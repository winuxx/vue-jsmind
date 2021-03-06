<template>
    <div id="js-mind">
        <span>{{msg}}</span>
        <div id="jsmind-container"
            v-on:click="onNodeSelected"
            v-on:dblclick="onNodeDbClick"
            v-bind:style="{'--fontSelected': fontSelected}"
        >
        <!-- '--fontSelected' should bind to one of the ancestors of <jmnode> -->
        </div>
        <div class="mind-ctrl">
            <div class="mind-ctrl-left">
                <label class="editable"> Editable <input type="checkbox" v-model="editable"></label>
                <button class="recovery"
                    :disabled="recoverDisabled"
                    v-on:click="onRecoverClick"
                > Recover </button>
            </div>
            <span>
                Theme:
                <select v-model="themeSelected">
                    <option v-for="themeOption in themeOptions" v-bind:key="themeOption.value">
                        {{ themeOption.text }}
                    </option>
                </select>
            </span>
            <span>
                Font:
                <select v-model="fontSelected">
                    <option v-for="fontOption in fontOptions" v-bind:key="fontOption.text">
                        {{ fontOption.value }}
                    </option>
                </select>
            </span>
            <div class="mind-ctrl-right">
                <button class="screenshot"
                    :disabled="screenshotDisabled"
                    v-on:click="onScreenshotClick"
                > Screenshot </button>
                <input type="file" id="import-browse-file" name="browseFile"
                    accept="application/json"
                    v-on:change="onImportFileChange"
                    required
                    style="display:none;"
                />
                <button class="import"
                    :disabled="importDisabled"
                    v-on:click="onImportClick"
                > Import </button>
                <button class="export"
                    :disabled="exportDisabled"
                    v-on:click="onExportClick"
                > Export </button>
            </div>
        </div>
        <SurroundCtrl
            v-bind:visible="surroundCtrlData.visible"
            v-bind:rect="surroundCtrlData.rect"
            v-bind:isRoot="surroundCtrlData.isRoot"
        >
            <!-- <template v-slot:ctrl-left><b> X </b></template> -->
        </SurroundCtrl>
        <TextEditor
            v-bind:visible="textEditorData.visible"
            v-bind:rect="textEditorData.rect"
            v-bind:value="textEditorData.value"
        >
        </TextEditor>
    </div>
</template>

<script>

import * as utils from '@/common/utils';
import JsMindApi from '@/common/jsmind-api';
import SurroundCtrl from './SurroundCtrl.vue';
import TextEditor from './TextEditor';

export default {
    name: 'Mind',
    components: {
        SurroundCtrl,
        TextEditor
    },
    props: {
        msg: String
    },
    data() {
        return {
            jm: null,
            editable: true,
            recoverDisabled: true,
            screenshotDisabled: false,
            importDisabled: false,
            exportDisabled: false,
            scrollTop: 0,
            surroundCtrlData: {
                visible: false,
                isRoot: Boolean,
                rect: {},
            },
            textEditorData: {
                visible: false,
                rect: {},
                value: '',
            },
            nodeid: 0,
            selectedNodeid: Number,
            mindDataLast: Object,
            themeOptions: [
                { text: 'primary', value: 'primary' },
                { text: 'warning', value: 'warning' },
                { text: 'danger', value: 'danger' },
                { text: 'success', value: 'success' },
            ],
            themeSelected: 'primary',
            fontOptions: [
                {text: 'sans', value: 'Sans-serif'},
                {text: 'serif', value: 'Serif'},
                {text: 'mono', value: 'Monospace'},
            ],
            fontSelected: 'Sans-serif',
        }
    },
    created() {
    },
    mounted() {
        this.jm = new JsMindApi();
        this.jm.init();
        let mindData = localStorage.getItem('mindData');
        if (mindData) {
            this.jm.show(JSON.parse(mindData));
        }
        window.addEventListener('scroll', this.onWindowScroll, true);
        window.onresize = this.onWindowResize;
        window.addEventListener('beforeunload', this.onPageUnload, true);
    },
    methods: {
        onNodeSelected() {
            console.log('onNodeSelected');
            let selectedNode = this.jm.getSelectedNode();
            // console.log('selectedNode:', selectedNode);
            if (!this.editable || !selectedNode) {
                this.surroundCtrlData.visible = false;
                this.textEditorData.visible = false;
                return;
            }
            let selectedElement = this.jm.getSelectedElement();
            // console.log('selectedElement:', selectedElement);
            if (selectedElement.getElementsByClassName('jsmind-editor').length > 0) {
                this.surroundCtrlData.visible = false;
            }
            else {
                let rect = selectedElement.getBoundingClientRect();
                this.surroundCtrlData.rect = rect;
                this.surroundCtrlData.isRoot = (selectedNode.id == 'root');
                this.surroundCtrlData.visible = true;
                this.selectedNodeid = selectedNode.id;
            }
            // console.log('surroundCtrlData:', this.surroundCtrlData);
        },
        onNodeDbClick() {
            console.log('onDbClick');
            let selectedElement = this.jm.getSelectedElement();
            let rect = selectedElement.getBoundingClientRect();
            let selectedNode = this.jm.getSelectedNode();
            let value = selectedNode.topic;
            this.surroundCtrlData.visible = false;
            // todo: the current TextEditor is not suitable, will write one.
            // this.textEditorData.visible = true;
            this.textEditorData.rect = rect;
            this.textEditorData.value = value;
        },
        onCtrlLeft() {
            console.log('onCtrlLeft');
            this.mindDataLast = this.jm.getData();
            // console.log('mindDataLast:', this.mindDataLast);
            this.jm.removeSelectedNode(this.selectedNodeid);
            // this.selectedNodeid should reset?
            this.surroundCtrlData.visible = false;
            this.recoverDisabled = false;
        },
        onCtrlRight() {
            console.log('onCtrlRight');
            this.nodeid += 1;
            this.jm.addChildForSelectedNode(this.nodeid);
            this.recoverDisabled = true;
            this.onNodeSelected();
        },
        onCtrlTop() {
            console.log('onCtrlTop');
            this.nodeid += 1;
            this.jm.addNodeBeforeSelected(this.nodeid);
            this.recoverDisabled = true;
            this.onNodeSelected();
        },
        onCtrlBottom() {
            console.log('onCtrlBottom');
            this.nodeid += 1;
            this.jm.addNodeAfterSelected(this.nodeid);
            this.recoverDisabled = true;
            this.onNodeSelected();
        },
        onRecoverClick() {
            console.log('onRecoverClick');
            if (!this.mindDataLast.data.id) {
                return;
            }
            this.jm.show(this.mindDataLast);
            this.recoverDisabled = true;
            this.onNodeSelected();
        },
        async onScreenshotClick() {
            console.log('onScreenshotClick');
            this.screenshotDisabled = true;
            this.jm.screenshot();
            await utils.sleep(1000);
            this.screenshotDisabled = false;
        },
        async onImportClick() {
            console.log('onImportClick');
            this.importDisabled = true;
            let browser = document.getElementById("import-browse-file");
            browser.click();
            await utils.sleep(1000);
            this.importDisabled = false;
        },
        async onImportFileChange (event) {
            console.log('onImportFileChange');
            let files = event.target.files;
            let data = await utils.readFile(files);
            this.jm.show(data);
            this.nodeid = 0;
        },
        async onExportClick() {
            console.log('onExportClick');
            this.exportDisabled = true;
            let data = this.jm.getData()
            let name = data.data.topic + '.json';
            let href = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(JSON.stringify(data));
            utils.download(name, href);
            await utils.sleep(1000);
            this.exportDisabled = false;
        },
        onWindowScroll() {
            console.log('onWindowScroll');
            this.scrollTop = document.documentElement.scrollTop ||
                document.body.scrollTop ||
                document.querySelector('.jsmind-inner').scrollTop;
            // console.log('scrollTop', this.scrollTop);
        },
        onWindowResize() {
            this.jm.reShow();

            // this.onNodeSelected();
            this.surroundCtrlData.visible = false;
        },
        onPageUnload() {
            console.log('onPageUnload');
            // Cancel the event as stated by the standard.
            // event.preventDefault();
            let mindData = this.jm.getData();
            localStorage.setItem('mindData', JSON.stringify(mindData));
        },
    },
     unmounted () {
        window.removeEventListener('scroll', this.onWindowScroll);
    },
    computed: {},
    watch: { // members should not watch each other
        editable: function(newval, oldval) {
            if (!newval && oldval) {
                this.surroundCtrlData.visible = false;
                this.jm.disableEdit();
                return;
            }
            this.jm.enableEdit();
            // 如果已经选中了node, 当editable从false变为true时, 显示ctrl
            let selectedElement = this.jm.getSelectedElement()
            if (selectedElement === undefined) {
                return;
            }
            let rect = selectedElement.getBoundingClientRect();
            this.surroundCtrlData.rect = rect;
            this.surroundCtrlData.visible = true;
        },
        scrollTop: async function(val) {
            // console.log('scrillTop:', val);
            this.surroundCtrlData.visible = false;
            await utils.sleep(300);
            if (val == this.scrollTop) {
                // scroll end
                this.surroundCtrlData.visible = true;
                this.onNodeSelected();
            }
        },
        themeSelected: function(val) {
            console.log('theme selected:', val);
            this.jm.setTheme(val);
        },
        fontSelected: function(val) {
            console.log('font selected:', val);
        },
    },
}

</script>

// import style from jsmind module
// this style should not be scoped
<style src='jsmind/style/jsmind.css'></style>

// extra style for jsmind
// this style should not be scoped
<style>
jmnode {
    font-family: var(--fontSelected) !important;
}
jmnode:not(.root) {
    /* max-width: 200px; */
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}
</style>

// style for jsmind container
// this style should not be scoped
<style>
#js-mind{
    height: calc(100% - 3.2rem);
}
#jsmind-container {
    background: #f0f8ff;
    /* width: 100%; */
    /* height: 100%; */
    height: calc(100% - 0.5rem);
    /* height: clamp(400px, 5vw, 100%); */
    /* margin:0.4rem; */
    border-radius: 0.6rem;
}
.jsmind-inner > canvas {
    left: 0;
}
.jsmind-inner > jmnodes {
    left :0;
}
</style>

<style scoped>
button {
    background: #3276b1;
    color: #f8f8f8;
    height: 1.5em;
    border: none;
    border-radius: 3px;
}
button:disabled {
    background: lightgray;
    color: gray;
}
select {
    background: #3276b1;
    color: #f8f8f8;
    height: 1.5em;
    border: none;
    border-radius: 3px;
    appearance: unset;
}
.mind-ctrl {
    /* float: right; */
    margin-top: 0.6rem;
    /* margin-right: 0.5em; */
}
.mind-ctrl-left {
    float: left;
}
.mind-ctrl-right {
    float: right;
}
.mind-ctrl-left > * {
    margin-right: 0.5em;
}
.mind-ctrl-right > * {
    margin-left: 0.5em;
}
</style>
