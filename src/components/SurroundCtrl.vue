<template>
    <div class="surround" v-show=visible>
        <button class="ctrl ctrl-vertical ctrl-left"
            :disabled=isRoot
            v-on:click=$parent.onCtrlLeft()
            v-bind:style="{ left: ctrlPosition.left[0] + 'px', top:  ctrlPosition.left[1] + 'px' }"
        >
            <slot name="ctrl-left"> X </slot>
        </button>
        <button class="ctrl ctrl-vertical ctrl-right"
            v-on:click=$parent.onCtrlRight()
            v-bind:style="{ left: ctrlPosition.right[0] + 'px', top:  ctrlPosition.right[1] + 'px' }"
        >
            <slot name="ctrl-right"><b> + </b></slot>
        </button>
        <button class="ctrl ctrl-horizon ctrl-top"
            :disabled=isRoot
            v-on:click=$parent.onCtrlTop()
            v-bind:style="{ left: ctrlPosition.top[0] + 'px', top:  ctrlPosition.top[1] + 'px' }"
        >
            <slot name="ctrl-top"><b> + </b></slot>
        </button>
        <button class="ctrl ctrl-horizon ctrl-bottom"
            :disabled=isRoot
            v-on:click=$parent.onCtrlBottom()
            v-bind:style="{ left: ctrlPosition.bottom[0] + 'px', top:  ctrlPosition.bottom[1] + 'px' }"
        >
            <slot name="ctrl-bottom"><b> + </b></slot>
        </button>
    </div>
</template>

<script>
export default {
    name: 'SurroundCtrl',
    components: {},
    props: {
        visible: Boolean,
        rect: DOMRect,
        isRoot: Boolean,
    },
    data() {
        return {
            ctrlPosition: {
                left: [],
                right: [],
                top: [],
                bottom: []
            }
        }
    },
    methods: {
        // 不能与父组件的方法同名
        // onCtrlLeft() {
        //     console.log('onCtrlLeft');
        // },
        // onCtrlRight() {
        //     console.log('onCtrlRight');
        // },
        // onCtrlTop() {
        //     console.log('onCtrlTop');
        // },
        // onCtrlBottom() {
        //     console.log('onCtrlBottom');
        // },
    },
    computed: {
    },
    watch: {
        rect: function(val) {
            // console.log('val:', val);
            this.ctrlPosition.left = [val.left - 24, val.top + val.height/2 - 18];
            this.ctrlPosition.right = [val.right, val.top + val.height/2 - 18];
            this.ctrlPosition.top = [val.left + val.width/2 -18, val.top - 24];
            this.ctrlPosition.bottom = [val.left + val.width/2 -18, val.bottom];
            // console.log('ctrlPosition:', this.ctrlPosition);
        }
    },
}

</script>

<style scoped>
button:disabled {
    background: lightgray;
    color: gray;
}
.ctrl {
    padding: 0;
    position: absolute;
    z-index: 10;
    border: none;
    background: #33a1ff;
    color: lightgoldenrodyellow
}
.ctrl-horizon {
    width: 36px;
    height: 24px;
}
.ctrl-vertical{
    width: 24px;
    height: 36px;
}
.ctrl-left {
    border-radius: 18px 0 0 18px;
    background: orangered;
}
.ctrl-right {
    border-radius: 0 18px 18px 0;
}
.ctrl-top {
    border-radius: 18px 18px 0 0;
}
.ctrl-bottom {
    border-radius: 0 0 18px 18px;
}
</style>
