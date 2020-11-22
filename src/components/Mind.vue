<template>
    <div id="js-mind">
        <span>{{msg}}</span>
        <div id="jsmind_container"
            v-on:click="onNodeSelected"
            v-on:dblclick="onNodeDbClick"
        >
        </div>
        <div class="mind-ctrl">
            <label class="editable">Editable<input type="checkbox" v-model="editable"></label>
            <span>author:Qian |:kk4201@126.com</span>
            <button class="recovery"
                :disabled="recoverDisabled"
                v-on:click="onRecoverClick"
             >Recover</button>
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
import jsMind from 'jsmind';
import jsMindMap from 'jsmind';
window.jsMind = jsMindMap;
require('jsmind/js/jsmind.draggable.js');
// import { debounce } from 'lodash';

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
            editable: true,
            recoverDisabled: true,
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
        jmInit();
        window.addEventListener('scroll', this.onWindowScroll, true);
        window.onresize = this.onWindowResize;
    },
    methods: {
        onNodeSelected() {
            console.log('onNodeSelected');
            let selectedNode = jm.get_selected_node();
            // console.log('selectedNode:', selectedNode);
            if (!this.editable || !selectedNode) {
                this.surroundCtrlData.visible = false;
                return;
            }
            let selectedElement = getSelectedElement();
            // console.log('selectedElement:', selectedElement);
            if (selectedElement.getElementsByClassName('jsmind-editor').length > 0) {
                this.surroundCtrlData.visible = false;
            }
            else {
                let rect = getRect(selectedElement);
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
            this.mindDataLast = jm.get_data().data;
            // console.log('mindDataLast:', this.mindDataLast);
            removeSelectedNode(this.selectedNodeid);
            // this.selectedNodeid should reset?
            this.surroundCtrlData.visible = false;
            this.recoverDisabled = false;
        },
        onCtrlRight() {
            console.log('onCtrlRight');
            this.nodeid += 1;
            addChildForSelectedNode(this.nodeid);
            this.recoverDisabled = true;
            this.onNodeSelected();
        },
        onCtrlTop() {
            console.log('onCtrlTop');
            this.nodeid += 1;
            addNodeBeforeSelected(this.nodeid);
            this.recoverDisabled = true;
            this.onNodeSelected();
        },
        onCtrlBottom() {
            console.log('onCtrlBottom');
            this.nodeid += 1;
            addNodeAfterSelected(this.nodeid);
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
            let mindData = jm.get_data();
            jm.show(mindData);

            // this.onNodeSelected();
            this.surroundCtrlData.visible = false;
        },
        onRecoverClick() {
            console.log('onRecoverClick');
            if (!this.mindDataLast.id) {
                return;
            }
            mind.data = this.mindDataLast;
            jm.show(mind);
            this.recoverDisabled = true;
            this.onNodeSelected();
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
                jm.disable_edit();
                return;
            }
            jm.enable_edit();
            // 如果已经选中了node, 当editable从false变为true时, 显示ctrl
            let selectedElement = getSelectedElement()
            if (selectedElement === undefined) {
                return;
            }
            let rect = getRect(selectedElement);
            this.surroundCtrlData.rect = rect;
            this.surroundCtrlData.visible = true;
        },
        scrollTop: async function(newval) {
            // console.log('scrillTop:', newval);
            this.surroundCtrlData.visible = false;
            const delay = ms => new Promise(res => setTimeout(res, ms));
            await delay(300);
            if (newval == this.scrollTop) {
                // scroll end
                this.surroundCtrlData.visible = true;
                this.onNodeSelected();
            }
        }
    },
}

let jm;

let mind = {
    /* 元数据，定义思维导图的名称、作者、版本等信息 */
    "meta":{
        "name":"Vue-jsMind",
        "author":"kk4201@126.com",
        "version":"0.1"
    },
    /* 数据格式声明 */
    "format":"node_tree",
    /* 数据内容 */
    /* ID could be Symbol() */
    "data":{"id":"root","topic":"new","children":[]}
};
let options = {
    container:'jsmind_container',
    editable: true,
    mode: 'side',
    theme:'primary'
};

function getAllNodes() {
    let nodes = document.getElementsByTagName('jmnode');
    console.log('nodes:', nodes);
}

function addChildForSelectedNode(nodeid) {
    console.log('addChildForSelectedNode', nodeid);
    let selectedNode = jm.get_selected_node();
    let topic = 'new' + nodeid;
    let data = {};
    jm.add_node(selectedNode, String(nodeid), topic, data);
    // getAllNodes(); //debug
}

function addNodeBeforeSelected(nodeid) {
    console.log('addChildForSelectedNode', nodeid);
    let selectedNode = jm.get_selected_node();
    let topic = 'new' + nodeid;
    let data = {};
    jm.insert_node_before(selectedNode, String(nodeid), topic, data);
}

function addNodeAfterSelected(nodeid) {
    console.log('addChildForSelectedNode', nodeid);
    let selectedNode = jm.get_selected_node();
    let topic = 'new' + nodeid;
    let data = {};
    jm.insert_node_after(selectedNode, String(nodeid), topic, data);
}

function removeSelectedNode(nodeid) {
    console.log('removeSelectedNode');
    jm.remove_node(nodeid);
}

function getSelectedElement() {
    // should get it under jmnodes
    let pNode = document.getElementsByTagName('jmnodes')[0];
    let sNode = pNode.getElementsByClassName('selected')[0];
    return sNode;
}

function getRect(element) {
    let rect = element.getBoundingClientRect();
    return rect;
}

function jmInit() {
    jm = new jsMind(options);
    jm.show(mind);

    getAllNodes();
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
.mind-ctrl {
    /* float: right; */
    margin-top: 0.6rem;
    /* margin-right: 0.5em; */
}
.editable {
    float: left;
}
.recovery {
    float: right;
}
</style>
