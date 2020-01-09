<!-- 页面打印组件 -->
<template>
  <span @click="handlePrint">
      <slot name="button">
        <el-button :type="type" :class="btnClass">
          {{text}}
        </el-button>
      </slot>
  </span>
</template>
<script>
  import {
    addClass,
    removeClass,
    hasClass,
    setStyle
  } from 'element-ui/lib/utils/dom';
  /**
   * XdhPrint
   * @module widgets/xdh-print
   * @author 李国师
   * @example
   *
   * // 使用说明
   *  <xdh-print print-range=".pring-range1">
   *  </xdh-print>
   *
   * // ----------或使用slot-------
   *
   *  <xdh-print print-range=".pring-range1">
   *    <el-button type="primary" icon="el-icon-tickets" slot="button"></el-button>
   *  </xdh-print>
   */
  /**
   * 作用域插槽
   * @member slot
   * @property {string} [button] 自定义按钮
   */
  export default {
    name: 'XdhPrint',
    /**
     * 属性参数
     * @member
     * @property {String} [text = '打印'] 按钮文字
     * @property {String} [type = 'default'] 按钮类型
     * @property {String} [btnClass] 按钮样式名称
     * @property {String} [printRange] 打印区域，css选择器，该参数为必须
     * @property {String} [containerClass = 'xdh-print-page-container'] 打印内容的容器className
     * @property {Function | HTMLElement | String} [parentDom] 作为父容器的dom对象，或者返回dom对象的方法,dom中必须包含container-class指定的className
     * @property {Object} [rootStyle] 顶层容器的样式,请不要设置position为absolute,relative或static, 否则分页效果会不起作用
     * @property {Function} [beforePrint] 在复制打印区域前执行，须返回promise对象
     * @property {Function} [afterPrint] 在打印完成之后执行
     * @property {String} [removeSelector] 打印时需要删除的元素选择器
     * @property {Array} [styleArray] 打印时须改变的样式数组，示例:[{selector: '.selector', style: {height: 'auto'}}]
     * @property {Function} [domTransfer] 自定义修改打印内容的方法
     * @property {Boolean} [disableDefaultStyle] 禁用默认样式数组，只使用style-array参数
     * @property {Boolean} [keepPreview] 打印后不删除页面打印内容
     */
    props: {
      text: {
        type: String,
        default: '打印'
      },
      type: {
        type: String,
        default: 'default'
      },
      btnClass: {
        type: String,
        default: ''
      },
      printRange: {
        type: String,
        default: '',
        required: true
      },
      containerClass: {
        type: String,
        default: 'xdh-print-page-container'
      },
      parentDom: [HTMLElement, Function, String],
      rootStyle: {
        type: Object,
        default: () => {
          return {};
        }
      },
      beforePrint: Function,
      afterPrint: Function,
      removeSelector: {
        type: String,
        default: ''
      },
      styleArray: {
        type: Array,
        default() {
          return [];
        }
      },
      domTransfer: Function,
      disableDefaultStyle: Boolean,
      keepPreview: Boolean
    },
    data() {
      return {
        handle: null,
        tDom: null,
        defaultStyles: [
          {
            selector: '.el-table',
            style: {
              height: 'auto'
            }
          },
          {
            selector: '.el-table__body-wrapper',
            style: {
              height: 'auto'
            }
          }
        ]
      };
    },
    methods: {
      handlePrint() {
        if (this.beforePrint && typeof this.beforePrint === 'function') {
          this.beforePrint().then(() => {
            this.print();
          });
        } else {
          this.print();
        }
      },
      domTransferDefault(tDom) {
        // 顶层容器默认的样式，请不要设置position为absolute,relative或static, 否则分页效果会不起作用
        let style = {
          width: '100%',
          'max-width': '1200px',
          'background-color': '#fff',
          padding: '0 80px 0 0',
          'box-sizing': 'border-box'
        };
        // 使用者自行传入的样式，如果有同名样式，会覆盖掉
        if (this.rootStyle) {
          style = Object.assign(style, this.rootStyle);
        }
        setStyle(tDom, style);
        // 在打印之前可能需要删除某些元素，可通过removeSelector传入选择器将其删除
        if (this.removeSelector) {
          let removeDoms = tDom.querySelectorAll(this.removeSelector);
          for (let i = 0; i < removeDoms.length; i++) {
            let item = removeDoms[i];
            if (item) {
              item.parentNode.removeChild(item);
            }
          }
        }
        // 在打印之前可能需要改变某些元素的样式，可以将一个数组通过styleArray传进来
        // 数组格式为 [{selector: '.selector-name',style: {height: 'auto'}}]
        let selectors;
        if (!this.disableDefaultStyle) {
          selectors = this.defaultStyles.concat(this.styleArray).concat([
            {
              selector: this.printRange,
              style: {
                height: 'auto'
              }
            }
          ]);
        } else {
          selectors = this.styleArray;
        }
        // 迭代改变每个打印区域的每个dom元素
        for (let i = 0; i < selectors.length; i++) {
          let elems = tDom.querySelectorAll(selectors[i].selector);
          for (let j = 0; j < elems.length; j++) {
            setStyle(elems[j], selectors[i].style);
          }
        }
        // 如果使用者需要编写自己的转换逻辑，则使用domTransfer参数传递一个处理方法
        let tDomTransfered;
        if (this.domTransfer && typeof this.domTransfer === 'function') {
          tDomTransfered = this.domTransfer(tDom, this);
        } else {
          tDomTransfered = tDom;
        }
        if (tDomTransfered) {
          return tDomTransfered;
        } else {
          throw new Error('domTransfer方法须返回正确的dom元素');
        }
      },
      removePrintPreview() {
        // 将打印区域外的元素重新显示
        let rootElems = document.querySelectorAll('body>*');
        for (let i = 0; i < rootElems.length; i++) {
          removeClass(rootElems[i], 'xdh-displaynone');
          removeClass(rootElems[i], 'xdh-print-hide');
        }
        // 删除打印区域
        document.body.removeChild(this.tDom);
        this.tDom = null;
      },
      createDom(innerHTML) {
        let con = document.createElement('div');
        con.innerHTML = innerHTML.toString();
        return con.childNodes[0];
      },
      prependDom(parent, elem) {
        parent.innerHTML = elem.outerHTML + parent.innerHTML;
        return parent;
      },
      closeAfterPrint() {
        this.handle = document.execCommand('print');
        if (this.handle) {
          // 如果不保留打印预览，则直接删除打印区域
          if (!this.keepPreview) {
            this.removePrintPreview();
          } else {
            // 如果尚未注册打印方法，则注册一个
            if (!window.closePrintPreview) {
              window.closePrintPreview = () => {
                this.removePrintPreview();
              };
            }
            // 隐藏除打印区域外的内容
            let rootElems = document.querySelectorAll('body>*');
            for (let i = 0; i < rootElems.length; i++) {
              addClass(rootElems[i], 'xdh-displaynone');
            }
            let tDom = this.tDom;
            removeClass(tDom, 'xdh-displaynone');
            // 添加打印预览头部
            let previewTitle = this
              .createDom(`<div class="xdh-print-preview-title xdh-print-hide">
                                                  <span class="title">打印预览</span>
                                                  <div class="xdh-print-preview-close" onclick="closePrintPreview()">关闭</div>
                                              </div>`);
            this.prependDom(tDom, previewTitle);
          }
          if (this.afterPrint && typeof this.afterPrint === 'function') {
            this.afterPrint();
          }
        } else {
          setTimeout(() => {
            this.closeAfterPrint();
          }, 300);
        }
      },
      print() {
        if (this.printRange) {
          // 将打印区域筛选出来用一个div包裹起来
          let contents = document.querySelectorAll(this.printRange);
          let con = document.createElement('div');
          for (let i = 0; i < contents.length; i++) {
            let cloneElem = contents[i].cloneNode(true);
            // 处理canvas元素，使用原来canvas对象的toDataURL方法生成base64,替换复制dom中的canvas
            let canvas = contents[i].querySelectorAll('canvas');
            let canvasClone = cloneElem.querySelectorAll('canvas');
            for (let j = 0; j < canvas.length; j++) {
              let imgSrc = canvas[j].toDataURL();
              let img = document.createElement('img');
              img.src = imgSrc;
              canvasClone[j].parentNode.replaceChild(img, canvasClone[j]);
            }
            // 添加分页符样式，最后一页不加分页符，否则如果最后一页占满了，会多出一页空白页
            if (i !== contents.length - 1) {
              addClass(cloneElem, 'xdh-print-page-break');
            }
            // 将复制的打印区域添加到容器中
            con.appendChild(cloneElem);
          }
          // 使用一个容器再包裹，方便后面移除
          let tDom = document.createElement('div');
          // tDom.id = 'body-print-range';
          // 在顶层容器和打印内容之间可以添加DOM元素，但需指定打印内容所在的class名称
          if (this.parentDom) {
            let parentDom;
            let parentCon;
            if (this.parentDom instanceof HTMLElement) {
              parentDom = this.parentDom;
            } else if (this.parentDom instanceof Function) {
              parentDom = this.parentDom();
            } else if (typeof this.parentDom === 'string') {
              parentDom = this.createDom(this.parentDom);
            } else {
              throw new Error('parent-dom必须为dom元素');
            }
            if (!(parentDom instanceof HTMLElement)) {
              throw new Error('parent-dom参数格式错误，无法生成合法的dom');
            }
            // 如果parentDom包含有container-class指定的类，则本身作为容器，否则查找内部是否有该类
            if (hasClass(parentDom, this.containerClass)) {
              parentCon = parentDom;
            } else {
              parentCon = parentDom.querySelector('.' + this.containerClass);
            }
            if (parentCon) {
              parentCon.appendChild(con);
              tDom.appendChild(parentDom);
            } else {
              throw new Error('没找到父容器，检查是否缺少container-class参数');
            }
          } else {
            tDom.className = this.containerClass;
            tDom.appendChild(con);
          }
          if (tDom) {
            let tDomTransfered;
            tDomTransfered = this.domTransferDefault(tDom);
            // body 下的元素都添加xdh-print-hide样式，打印时隐藏
            let rootElems = document.querySelectorAll('body>*');
            for (let i = 0; i < rootElems.length; i++) {
              addClass(rootElems[i], 'xdh-print-hide');
            }
            this.tDom = tDomTransfered;
            // 打印内容添加到body下
            document.body.appendChild(tDomTransfered);
          }
          setTimeout(() => {
            this.closeAfterPrint();
          }, 20);
        } else {
          window.print();
        }
      }
    }
  };
</script>
