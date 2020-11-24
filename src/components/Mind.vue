<template>
    <div id="js-mind">
        <span>{{msg}}</span>
        <div id="jsmind_container"
            v-on:click="onNodeSelected"
            v-on:dblclick="onNodeDbClick"
        >
        </div>
        <div class="mind-ctrl">
            <div class="mind-ctrl-left">
                <label class="editable"> Editable <input type="checkbox" v-model="editable"></label>
                <button class="recovery"
                    :disabled="recoverDisabled"
                    v-on:click="onRecoverClick"
                > Recover </button>
            </div>
            <span>author: Qian | kk4201@126.com</span>
            <div class="mind-ctrl-right">
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
    </div>
</template>

<script>

import * as utils from '@/common/utils';
import JsMindApi from '@/common/jsmind-api';
import SurroundCtrl from './SurroundCtrl.vue';

export default {
    name: 'Mind',
    components: {
        SurroundCtrl
    },
    props: {
        msg: String
    },
    data() {
        return {
            jm: null,
            editable: true,
            recoverDisabled: true,
            importDisabled: false,
            exportDisabled: false,
            scrollTop: 0,
            surroundCtrlData: {
                visible: false,
                isRoot: Boolean,
                rect: {},
            },
            nodeid: 0,
            selectedNodeid: Number,
            mindDataLast: Object,
        }
    },
    created() {
    },
    mounted() {
        this.jm = new JsMindApi();
        this.jm.init();
        window.addEventListener('scroll', this.onWindowScroll, true);
        window.onresize = this.onWindowResize;
    },
    methods: {
        onNodeSelected() {
            console.log('onNodeSelected');
            let selectedNode = this.jm.getSelectedNode();
            // console.log('selectedNode:', selectedNode);
            if (!this.editable || !selectedNode) {
                this.surroundCtrlData.visible = false;
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
            this.surroundCtrlData.visible = false;
        },
        onCtrlLeft() {
            console.log('onCtrlLeft');
            this.mindDataLast = this.jm.getMindData();
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
        onRecoverClick() {
            console.log('onRecoverClick');
            if (!this.mindDataLast.data.id) {
                return;
            }
            this.jm.show(this.mindDataLast);
            this.recoverDisabled = true;
            this.onNodeSelected();
        },
        async onImportClick() {
            console.log('onImportClick');
            this.importDisabled = true;
            let browser = document.getElementById("import-browse-file");
            browser.click();
        },
        async onImportFileChange (event) {
            console.log('onImportFileChange');
            let files = event.target.files;
            let data = await utils.readFile(files);
            this.jm.show(data);
            this.importDisabled = false;
        },
        async onExportClick() {
            console.log('onExportClick');
            this.exportDisabled = true;
            let data = this.jm.getMindData()
            let name = data.data.topic + '.json';
            let href = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(JSON.stringify(data));
            utils.download(name, href);
            await utils.sleep(1000);
            this.exportDisabled = false;
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
        scrollTop: async function(newval) {
            // console.log('scrillTop:', newval);
            this.surroundCtrlData.visible = false;
            await utils.sleep(300);
            if (newval == this.scrollTop) {
                // scroll end
                this.surroundCtrlData.visible = true;
                this.onNodeSelected();
            }
        }
    },
}

</script>

// import style from jsmind module
// this style should not be scoped
<style src='jsmind/style/jsmind.css'></style>

// extra style for jsmind
// this style should not be scoped
<style>
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
#jsmind_container {
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
    background: #33a1ff;
    height: 1.5em;
    border: none;
    border-radius: 3px;
}
button:disabled {
    background: lightgray;
    color: gray;
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
