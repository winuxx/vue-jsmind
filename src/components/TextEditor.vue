<template>
    <div id="text-editor"
        v-show=visible
        v-bind:style="{ left: editorPosition.left + 'px', top: editorPosition.top + 'px' }"
    >
        <div id="text-input"></div>
    </div>
</template>

<script>
import Quill from 'quill'

export default {
    name: 'TextEditor',
    props: {
        visible: Boolean,
        rect: DOMRect,
        value: Object,
    },
    data() {
        return {
            quill: null,
            options: {
                theme: 'snow',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                    ]
                }
            },
            toolbarPosition: {
                left: 0,
                bottom: 0,
            },
            editorPosition: {
                left: 0,
                top: 0,
            },
        }
    },
    mounted() {
        let editor = document.getElementById('text-input');
        this.quill = new Quill(editor, this.options);
        this.quill.setContents(this.value);
        this.quill.on('text-change', () => {
            // .jsmind-editor
            this.$emit('input', this.quill.getContents());
        });
    },
    watch: {
        rect: function(val) {
            // console.log('rect:', val);
            this.toolbarPosition.left = val.left;
            this.toolbarPosition.bottom = val.top;
            this.editorPosition.left = val.left;
            this.editorPosition.top = val.top;
        },
        value: function(val) {
            console.log('value:', val);
            this.quill.setText(val);
        }
    },
}
</script>

<style src='quill/dist/quill.snow.css'>
</style>

<style>
.ql-toolbar.ql-snow {
    position: absolute;
    top: -40px;
    width: 200px;
    height: 40px;
    background: #f8f8f8;
}
</style>

<style>
#text-editor {
    position: absolute;
    top: 0;
    width: 200px;
    height: auto;
    background: #fff;
    z-index: 100;
}
</style>
