import jsMind from 'jsmind';
import jsMindMap from 'jsmind';
window.jsMind = jsMindMap; // NOLINT
require('jsmind/js/jsmind.draggable.js'); // NOLINT

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

export class JsMindApi {
    getAllNodes() {
        return document.getElementsByTagName('jmnode');
    }

    getSelectedNode() {
        return jm.get_selected_node();
    }

    addChildForSelectedNode(nodeid) {
        console.log('addChildForSelectedNode', nodeid);
        let selectedNode = jm.get_selected_node();
        let topic = 'new' + nodeid;
        let data = {};
        jm.add_node(selectedNode, String(nodeid), topic, data);
    }

    addNodeBeforeSelected(nodeid) {
        console.log('addChildForSelectedNode', nodeid);
        let selectedNode = jm.get_selected_node();
        let topic = 'new' + nodeid;
        let data = {};
        jm.insert_node_before(selectedNode, String(nodeid), topic, data);
    }

    addNodeAfterSelected(nodeid) {
        console.log('addChildForSelectedNode', nodeid);
        let selectedNode = jm.get_selected_node();
        let topic = 'new' + nodeid;
        let data = {};
        jm.insert_node_after(selectedNode, String(nodeid), topic, data);
    }

    removeSelectedNode(nodeid) {
        console.log('removeSelectedNode');
        jm.remove_node(nodeid);
    }

    getSelectedElement() {
        // should get it under jmnodes
        let pNode = document.getElementsByTagName('jmnodes')[0];
        let sNode = pNode.getElementsByClassName('selected')[0];
        return sNode;
    }

    getMindData() {
        return jm.get_data();
    }

    show(mindData) {
        mind.data = mindData;
        jm.show(mind);
}

    reShow() {
        let mindData = jm.get_data();
        jm.show(mindData);
    }

    enableEdit() {
        jm.enable_edit();
    }

    disableEdit() {
        jm.disable_edit();
    }

    init() {
        jm = new jsMind(options);
        jm.show(mind);
    }
}

export default JsMindApi;
