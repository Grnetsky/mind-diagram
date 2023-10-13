import {createDom} from "@meta2d/mind-diagram/src/dom";
import {toolBoxPlugin} from "@meta2d/mind-diagram";

export let defaultFuncList = {
  'root':[
    {
      name: '新增子级节点',
      event: 'click',
      func: async (self,pen)=>{
        toolBoxPlugin.addNode(pen,0);
      },
      icon:'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzRweCIgaGVpZ2h0PSIzNHB4IiB2aWV3Qm94PSIwIDAgMzQgMzQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+5LiL57qn6IqC54K5PC90aXRsZT4KICAgIDxkZWZzPgogICAgICAgIDxyZWN0IGlkPSJwYXRoLTEiIHg9IjE0IiB5PSIxOCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjciIHJ4PSIxIj48L3JlY3Q+CiAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgbWFza0NvbnRlbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIG1hc2tVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHg9IjAiIHk9IjAiIHdpZHRoPSIxNiIgaGVpZ2h0PSI3IiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgPC9tYXNrPgogICAgPC9kZWZzPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5Zu65a6aIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzM2LjAwMDAwMCwgLTI3LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTLlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE4Mi4wMDAwMDAsIDI0LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IuS4i+e6p+iKgueCuSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTU0LjAwMDAwMCwgMy4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i6YCP5piO5bqV5Zu+IiBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiNGRkZGRkYiIHg9IjAiIHk9IjAiIHdpZHRoPSIzNCIgaGVpZ2h0PSIzNCI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnn6nlvaLlpIfku70tNiIgc3Ryb2tlPSIjODE4MTg3IiB4PSI0LjUiIHk9IjguNSIgd2lkdGg9IjE1IiBoZWlnaHQ9IjYiIHJ4PSIxIj48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9IjEyIiB5MT0iMjIiIHgyPSIxNCIgeTI9IjIyIiBpZD0i55u057q/LTciIHN0cm9rZT0iIzgxODE4NyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48L2xpbmU+CiAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9IjEyIiB5MT0iMTUiIHgyPSIxMiIgeTI9IjIyIiBpZD0i55u057q/LTYiIHN0cm9rZT0iIzgxODE4NyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48L2xpbmU+CiAgICAgICAgICAgICAgICAgICAgPHVzZSBpZD0i55+p5b2i5aSH5Lu9LTUiIHN0cm9rZT0iIzlDOUNBNSIgbWFzaz0idXJsKCNtYXNrLTIpIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjIiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4='
      /**
       * @description 通过此函数你可以自由地自定义工具栏的样式 采用影子dom 使得style相互隔离
       * @param self 此配置项自身
       * @param dom 插件提供的包含容器 即你创建的dom的外部div对象
       * @return string dom字符串
       * */
    },
    {
      name:'重新布局',
      event:'click',
      func(self,pen){
        let children = pen.mind?.children || [];
        if(children.length >0){
          toolBoxPlugin.update(pen,true);
        }
      },
      setDom(self,dom){
        // draw your dom freeDom！！！
        let result =  `<span>${self.name}</span>`;
        return result;
      }
    },
    {
      name:'仅计算子节点',
      event:'click',
      func(self,pen){
        let children = pen.mind?.children || [];
        if(children.length >0){
          toolBoxPlugin.update(pen,false);
        }
      }
    },
    {
      name:'线条颜色',
      setChildrenDom(self, pen): any {
        let HTML = `<div class="container">
            颜色选择器
        </div>`
        let CSS = `<style>
        .container {
        display: flex;
        justify-content: center;
        align-content: center;
        visibility: hidden;
        color: skyblue;
        background-color:#fff;
        }
        </style>`
        return HTML + CSS;
      }
    },{
      name:'连线方式',
      children:[
        {
          name:'脑图曲线',
          event:'click',
          func(self,pen){
            let root = meta2d.findOne(pen.mindManager.rootId);
            root.mind.lineStyle = 'curve';
            toolBoxPlugin.resetLineStyle(root);
            toolBoxPlugin.update(root);
          }
        },
        {
          name:'折线',
          event:'click',
          func(self,pen){
            let root = meta2d.findOne(pen.mindManager.rootId);
            root.mind.lineStyle = 'polyline';
            toolBoxPlugin.resetLineStyle(root);
            toolBoxPlugin.update(root);
          }
        }
      ]
    },
    {
      name:'布局方式',
      event: 'click',
      func(self,pen,dom){
        let root = dom.shadowRoot.querySelector('.root')
        let divs = root.querySelectorAll('div');
        let index = self.children.findIndex(i=>i.key === pen.mind.direction)
        divs.forEach(i=>{
          i.querySelectorAll('.toolbox_direction_svg').forEach(i=>{
            i.setAttribute('fill','#DDDDE1');
          })
          i.querySelectorAll('.toolbox_direction_svg_base').forEach(i=>{
            i.setAttribute('fill','#F8F8FC');
          })
          i.querySelectorAll('.toolbox_direction_svg_line').forEach(i=>{
            i.setAttribute('stroke','#818187');
          })
        })

        divs[index].querySelector('.toolbox_direction_svg_base').setAttribute('fill','#CDCDFC')
        divs[index].querySelector('.toolbox_direction_svg_line').setAttribute('stroke','#7878FF')
        divs[index].querySelectorAll('.toolbox_direction_svg').forEach(i=>i.setAttribute('fill','#7878FF'))
      },
      children:[
        {
          key:'right',
          name:'',
          event:'click',
          icon:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="76px" height="50px" viewBox="0 0 76 50" version="1.1">\n' +
            '    <title>向右布局 9</title>\n' +
            '    <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
            '        <g id="未固定" transform="translate(-633.000000, -684.000000)">\n' +
            '            <g id="编组-6备份" transform="translate(525.000000, 423.000000)">\n' +
            '                <g id="布局备份-9" transform="translate(108.000000, 261.000000)">\n' +
            '                    <rect class="toolbox_direction_svg_base" id="偷摸底图" fill="#F8F8FC" x="0" y="0" width="76" height="50" rx="2"/>\n' +
            '                    <g id="编组-3" transform="translate(20.000000, 7.000000)">\n' +
            '                        <line class="toolbox_direction_svg" x1="13.5" y1="18.5" x2="22.969697" y2="18.5" id="直线-12备份-2" stroke="#818187" stroke-linecap="round"/>\n' +
            '                        <rect class="toolbox_direction_svg_line" id="矩形" stroke="#818187" x="0.5" y="15.5" width="13" height="5" rx="2"/>\n' +
            '                        <path class="toolbox_direction_svg_line" d="M28,35 C22.4771525,35 18,27.836556 18,19 C18,10.163444 22.4771525,3 28,3" id="路径" stroke="#818187" stroke-linecap="round"/>\n' +
            '                        <rect class="toolbox_direction_svg" id="矩形备份-11" fill="#DDDDE1" x="25" y="0" width="10" height="5" rx="2"/>\n' +
            '                        <rect class="toolbox_direction_svg" id="矩形备份-12" fill="#DDDDE1" x="25" y="16" width="10" height="5" rx="2"/>\n' +
            '                        <rect class="toolbox_direction_svg" id="矩形备份-13" fill="#DDDDE1" x="25" y="32" width="10" height="5" rx="2"/>\n' +
            '                    </g>\n' +
            '                </g>\n' +
            '            </g>\n' +
            '        </g>\n' +
            '    </g>\n' +
            '</svg>',
          func(self,pen){
            let root = meta2d.findOne(pen.mindManager.rootId);
            root.mind.direction = 'right';
            toolBoxPlugin.resetDirection(root,'right',true);
            toolBoxPlugin.update(root);
          }
        },
        {
          name:'',
          key:'left',
          event:'click',
          icon:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="76px" height="50px" viewBox="0 0 76 50" version="1.1">\n' +
            '    <title>布局备份 8</title>\n' +
            '    <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
            '        <g id="未固定" transform="translate(-541.000000, -684.000000)">\n' +
            '            <g id="编组-6备份" transform="translate(525.000000, 423.000000)">\n' +
            '                <g id="布局备份-8" transform="translate(16.000000, 261.000000)">\n' +
            '                    <rect class="toolbox_direction_svg_base" id="透明底图" fill="#F8F8FC" x="0" y="0" width="76" height="50" rx="2"/>\n' +
            '                    <g id="编组-3" transform="translate(37.500000, 25.500000) scale(-1, 1) translate(-37.500000, -25.500000) translate(20.000000, 7.000000)">\n' +
            '                        <line class="toolbox_direction_svg" x1="13.5" y1="18.5" x2="22.969697" y2="18.5" id="直线-12备份-2" stroke="#818187" stroke-linecap="round"/>\n' +
            '                        <rect class="toolbox_direction_svg_line" id="矩形" stroke="#818187" x="0.5" y="15.5" width="13" height="5" rx="2"/>\n' +
            '                        <path class="toolbox_direction_svg_line" d="M28,35 C22.4771525,35 18,27.836556 18,19 C18,10.163444 22.4771525,3 28,3" id="路径" stroke="#818187" stroke-linecap="round"/>\n' +
            '                        <rect class="toolbox_direction_svg" id="矩形备份-11" fill="#DDDDE1" x="25" y="0" width="10" height="5" rx="2"/>\n' +
            '                        <rect class="toolbox_direction_svg" id="矩形备份-12" fill="#DDDDE1" x="25" y="16" width="10" height="5" rx="2"/>\n' +
            '                        <rect class="toolbox_direction_svg" id="矩形备份-13" fill="#DDDDE1" x="25" y="32" width="10" height="5" rx="2"/>\n' +
            '                    </g>\n' +
            '                </g>\n' +
            '            </g>\n' +
            '        </g>\n' +
            '    </g>\n' +
            '</svg>',
          func(self,pen){
            console.log(self,pen)
            let root = meta2d.findOne(pen.mindManager.rootId);
            root.mind.direction = 'left';

            toolBoxPlugin.resetDirection(root,'left',true);
            toolBoxPlugin.update(root);
          }
        },
        {
          name:'',
          key:'top',
          event:'click',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="76px" height="50px" viewBox="0 0 76 50" version="1.1">\n' +
            '    <title>布局备份 7</title>\n' +
            '    <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
            '        <g id="未固定" transform="translate(-633.000000, -616.000000)">\n' +
            '            <g id="编组-6备份" transform="translate(525.000000, 423.000000)">\n' +
            '                <g id="布局备份-7" transform="translate(108.000000, 193.000000)">\n' +
            '                    <rect class="toolbox_direction_svg_base" id="透明底图" fill="#F8F8FC" x="0" y="0" width="76" height="50" rx="2"/>\n' +
            '                    <g id="编组-3" transform="translate(38.000000, 25.250000) scale(1, -1) rotate(-270.000000) translate(-38.000000, -25.250000) translate(25.750000, 0.750000)">\n' +
            '                        <line class="toolbox_direction_svg" x1="6.06363636" y1="25.5" x2="15.5333333" y2="25.5" id="直线-12备份-2" stroke="#818187" stroke-linecap="round"/>\n' +
            '                        <rect class="toolbox_direction_svg_line" id="矩形" stroke="#818187" transform="translate(3.000000, 25.500000) rotate(-90.000000) translate(-3.000000, -25.500000) " x="-3.5" y="23" width="13" height="5" rx="2"/>\n' +
            '                        <path class="toolbox_direction_svg_line" d="M17.8386311,43 C15.0303966,40.513797 13,33.3135934 13,24.8187892 C13,16.7047472 14.8524591,9.77185117 17.465812,7" id="路径" stroke="#818187" stroke-linecap="round"/>\n' +
            '                        <rect class="toolbox_direction_svg" id="矩形备份-11" fill="#DDDDE1" transform="translate(22.000000, 44.000000) rotate(-90.000000) translate(-22.000000, -44.000000) " x="17" y="41.5" width="10" height="5" rx="2"/>\n' +
            '                        <rect class="toolbox_direction_svg" id="矩形备份-12" fill="#DDDDE1" transform="translate(22.000000, 25.000000) rotate(-90.000000) translate(-22.000000, -25.000000) " x="17" y="22.5" width="10" height="5" rx="2"/>\n' +
            '                        <rect class="toolbox_direction_svg" id="矩形备份-13" fill="#DDDDE1" transform="translate(22.000000, 5.000000) rotate(-90.000000) translate(-22.000000, -5.000000) " x="17" y="2.5" width="10" height="5" rx="2"/>\n' +
            '                    </g>\n' +
            '                </g>\n' +
            '            </g>\n' +
            '        </g>\n' +
            '    </g>\n' +
            '</svg>',
          func(self,pen){
            let root = meta2d.findOne(pen.mindManager.rootId);
            root.mind.direction = 'top';
            toolBoxPlugin.resetDirection(root,'top',true);
            toolBoxPlugin.update(root);
          }
        },
        {
          name:'',
          key:'bottom',
          icon:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="76px" height="50px" viewBox="0 0 76 50" version="1.1">\n' +
            '    <title>布局备份 2</title>\n' +
            '    <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
            '        <g id="未固定" transform="translate(-725.000000, -480.000000)">\n' +
            '            <g id="编组-6备份" transform="translate(525.000000, 423.000000)">\n' +
            '                <g id="布局备份-2" transform="translate(200.000000, 57.000000)">\n' +
            '                    <rect class="toolbox_direction_svg_base" id="透明底图" fill="#F8F8FC" x="0" y="0" width="76" height="50" rx="2"/>\n' +
            '                    <g id="编组-3" transform="translate(38.000000, 25.250000) rotate(-270.000000) translate(-38.000000, -25.250000) translate(25.750000, 0.750000)">\n' +
            '                        <line x1="6.06363636" y1="25.5" x2="15.5333333" y2="25.5" id="直线-12备份-2" stroke="#818187" stroke-linecap="round"/>\n' +
            '                        <rect class="toolbox_direction_svg_line" id="矩形" stroke="#818187" transform="translate(3.000000, 25.500000) rotate(-90.000000) translate(-3.000000, -25.500000) " x="-3.5" y="23" width="13" height="5" rx="2"/>\n' +
            '                        <path class="toolbox_direction_svg_line" d="M17.8386311,43 C15.0303966,40.513797 13,33.3135934 13,24.8187892 C13,16.7047472 14.8524591,9.77185117 17.465812,7" id="路径" stroke="#818187" stroke-linecap="round"/>\n' +
            '                        <rect class="toolbox_direction_svg" id="矩形备份-11" fill="#DDDDE1" transform="translate(22.000000, 44.000000) rotate(-90.000000) translate(-22.000000, -44.000000) " x="17" y="41.5" width="10" height="5" rx="2"/>\n' +
            '                        <rect class="toolbox_direction_svg" id="矩形备份-12" fill="#DDDDE1" transform="translate(22.000000, 25.000000) rotate(-90.000000) translate(-22.000000, -25.000000) " x="17" y="22.5" width="10" height="5" rx="2"/>\n' +
            '                        <rect class="toolbox_direction_svg" id="矩形备份-13" fill="#DDDDE1" transform="translate(22.000000, 5.000000) rotate(-90.000000) translate(-22.000000, -5.000000) " x="17" y="2.5" width="10" height="5" rx="2"/>\n' +
            '                    </g>\n' +
            '                </g>\n' +
            '            </g>\n' +
            '        </g>\n' +
            '    </g>\n' +
            '</svg>',
          event:'click',
          func(self,pen){
            let root = meta2d.findOne(pen.mindManager.rootId);
            root.mind.direction = 'bottom';
            toolBoxPlugin.resetDirection(root,'bottom',true);
            toolBoxPlugin.update(root);
          }
        },
      ],
      // 设置下拉列表的样式和子元素布局
      setChildrenDom(self,pen){
        let dom = createDom('div',{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          position:'absolute',
          visibility:'hidden',
          top:'38px',
          backgroundColor:'#fff',
          borderRadius:'5px',
          padding:'3px',
          zIndex: 999,
          width: '185px',
          boxShadow: '0px 6px 20px rgba(25,25,26,.06), 0px 2px 12px rgba(25,25,26,.04)',
        },'',undefined,'root');
         dom.innerHTML = `
        <style>
         .active {
          border-color: red;
          border-width: 5px;
        }
        </style>
       `
        dom.addEventListener('click',(e)=>{
          dom.childNodes.forEach((i)=>{
            if(i.tagName !== 'style' && i.nodeType == 1){
              i.classList.remove('active')
            }
          });
          e.target.classList.add('active');
        })
        return dom ;
      }
    }
  ],
    'leaf':[
    {
      name: '新增同级节点',
      event: 'click',
      func: async (self,pen)=>{
        if(pen.mind.type === 'mind-node-1' ){
          let parent = meta2d.findOne(pen.mind.preNodeId);
          let index = parent.mind.children.indexOf(pen);
          await toolBoxPlugin.addNode(parent,index+1);
        }
      },
      icon:'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzRweCIgaGVpZ2h0PSIzNHB4IiB2aWV3Qm94PSIwIDAgMzQgMzQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+5ZCM57qn6IqC54K5PC90aXRsZT4KICAgIDxkZWZzPgogICAgICAgIDxyZWN0IGlkPSJwYXRoLTEiIHg9IjkiIHk9IjgiIHdpZHRoPSIxNiIgaGVpZ2h0PSI3Ij48L3JlY3Q+CiAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgbWFza0NvbnRlbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIG1hc2tVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHg9IjAiIHk9IjAiIHdpZHRoPSIxNiIgaGVpZ2h0PSI3IiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgPC9tYXNrPgogICAgPC9kZWZzPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5Zu65a6aIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjkwLjAwMDAwMCwgLTI3LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTLlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE4Mi4wMDAwMDAsIDI0LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IuWQjOe6p+iKgueCuSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTA4LjAwMDAwMCwgMy4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i6YCP5piO5bqV5Zu+IiBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiNGRkZGRkYiIHg9IjAiIHk9IjAiIHdpZHRoPSIzNCIgaGVpZ2h0PSIzNCI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnn6nlvaIiIHN0cm9rZT0iIzgxODE4NyIgeD0iOS41IiB5PSIxOC41IiB3aWR0aD0iMTUiIGhlaWdodD0iNiIgcng9IjEiPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT0iMTciIHkxPSIxNSIgeDI9IjE3IiB5Mj0iMTgiIGlkPSLnm7Tnur8tNiIgc3Ryb2tlPSIjODE4MTg3IiBzdHJva2UtbGluZWNhcD0icm91bmQiPjwvbGluZT4KICAgICAgICAgICAgICAgICAgICA8dXNlIGlkPSLnn6nlvaLlpIfku70tNCIgc3Ryb2tlPSIjOUM5Q0E1IiBtYXNrPSJ1cmwoI21hc2stMikiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iMiIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=='
    },
    {
      name: '新增子级节点',
      event: 'click',
      func: async (self,pen)=>{
        await toolBoxPlugin.addNode(pen,0);
      },
      icon:'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzRweCIgaGVpZ2h0PSIzNHB4IiB2aWV3Qm94PSIwIDAgMzQgMzQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+5LiL57qn6IqC54K5PC90aXRsZT4KICAgIDxkZWZzPgogICAgICAgIDxyZWN0IGlkPSJwYXRoLTEiIHg9IjE0IiB5PSIxOCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjciIHJ4PSIxIj48L3JlY3Q+CiAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgbWFza0NvbnRlbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIG1hc2tVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHg9IjAiIHk9IjAiIHdpZHRoPSIxNiIgaGVpZ2h0PSI3IiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgPC9tYXNrPgogICAgPC9kZWZzPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5Zu65a6aIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzM2LjAwMDAwMCwgLTI3LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTLlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE4Mi4wMDAwMDAsIDI0LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IuS4i+e6p+iKgueCuSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTU0LjAwMDAwMCwgMy4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i6YCP5piO5bqV5Zu+IiBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiNGRkZGRkYiIHg9IjAiIHk9IjAiIHdpZHRoPSIzNCIgaGVpZ2h0PSIzNCI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnn6nlvaLlpIfku70tNiIgc3Ryb2tlPSIjODE4MTg3IiB4PSI0LjUiIHk9IjguNSIgd2lkdGg9IjE1IiBoZWlnaHQ9IjYiIHJ4PSIxIj48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9IjEyIiB5MT0iMjIiIHgyPSIxNCIgeTI9IjIyIiBpZD0i55u057q/LTciIHN0cm9rZT0iIzgxODE4NyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48L2xpbmU+CiAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9IjEyIiB5MT0iMTUiIHgyPSIxMiIgeTI9IjIyIiBpZD0i55u057q/LTYiIHN0cm9rZT0iIzgxODE4NyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48L2xpbmU+CiAgICAgICAgICAgICAgICAgICAgPHVzZSBpZD0i55+p5b2i5aSH5Lu9LTUiIHN0cm9rZT0iIzlDOUNBNSIgbWFzaz0idXJsKCNtYXNrLTIpIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjIiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4='
    },
    {
      name:'仅计算子节点',
      event:'click',
      func(self,pen){
        if(pen.mind.children.length >0){
          toolBoxPlugin.update(pen,false);
        }
      }
    },{
      name:'连线方式',
      children:[
        {
          name:'脑图曲线',
          event:'click',
          func(self,pen){
            let root = meta2d.findOne(pen.mindManager.rootId);
            root.mind.lineStyle = 'curve';
            toolBoxPlugin.resetLineStyle(root);
            // toolBoxPlugin.update(root);
          }
        },
        {
          name:'折线',
          event:'click',
          func(self,pen){
            let root = meta2d.findOne(pen.mindManager.rootId);
            root.mind.lineStyle = 'polyline';
            toolBoxPlugin.resetLineStyle(root);
            // toolBoxPlugin.update(root);
          }
        }
      ]
    },
    {
      name:'布局方式',
      children:[
        {
          name:'',
          event:'click',
          icon:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="76px" height="50px" viewBox="0 0 76 50" version="1.1">\n' +
            '    <title>布局备份 9</title>\n' +
            '    <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
            '        <g id="未固定" transform="translate(-633.000000, -684.000000)">\n' +
            '            <g id="编组-6备份" transform="translate(525.000000, 423.000000)">\n' +
            '                <g id="布局备份-9" transform="translate(108.000000, 261.000000)">\n' +
            '                    <rect id="透明底图" fill="#F8F8FC" x="0" y="0" width="76" height="50" rx="2"/>\n' +
            '                    <g id="编组-3" transform="translate(20.000000, 7.000000)">\n' +
            '                        <line x1="13.5" y1="18.5" x2="22.969697" y2="18.5" id="直线-12备份-2" stroke="#818187" stroke-linecap="round"/>\n' +
            '                        <rect id="矩形" stroke="#818187" x="0.5" y="15.5" width="13" height="5" rx="2"/>\n' +
            '                        <path d="M28,35 C22.4771525,35 18,27.836556 18,19 C18,10.163444 22.4771525,3 28,3" id="路径" stroke="#818187" stroke-linecap="round"/>\n' +
            '                        <rect id="矩形备份-11" fill="#DDDDE1" x="25" y="0" width="10" height="5" rx="2"/>\n' +
            '                        <rect id="矩形备份-12" fill="#DDDDE1" x="25" y="16" width="10" height="5" rx="2"/>\n' +
            '                        <rect id="矩形备份-13" fill="#DDDDE1" x="25" y="32" width="10" height="5" rx="2"/>\n' +
            '                    </g>\n' +
            '                </g>\n' +
            '            </g>\n' +
            '        </g>\n' +
            '    </g>\n' +
            '</svg>',
          func(self,pen){
            let root = meta2d.findOne(pen.mindManager.rootId);
            root.mind.direction = 'right';
            toolBoxPlugin.resetDirection(root,'right',true);
            toolBoxPlugin.resetLinePos(root,true)
            toolBoxPlugin.update(root);
          }
        },
        {
          name:'',
          event:'click',
          icon:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="76px" height="50px" viewBox="0 0 76 50" version="1.1">\n' +
            '    <title>布局备份 8</title>\n' +
            '    <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
            '        <g id="未固定" transform="translate(-541.000000, -684.000000)">\n' +
            '            <g id="编组-6备份" transform="translate(525.000000, 423.000000)">\n' +
            '                <g id="布局备份-8" transform="translate(16.000000, 261.000000)">\n' +
            '                    <rect id="透明底图" fill="#F8F8FC" x="0" y="0" width="76" height="50" rx="2"/>\n' +
            '                    <g id="编组-3" transform="translate(37.500000, 25.500000) scale(-1, 1) translate(-37.500000, -25.500000) translate(20.000000, 7.000000)">\n' +
            '                        <line x1="13.5" y1="18.5" x2="22.969697" y2="18.5" id="直线-12备份-2" stroke="#818187" stroke-linecap="round"/>\n' +
            '                        <rect id="矩形" stroke="#818187" x="0.5" y="15.5" width="13" height="5" rx="2"/>\n' +
            '                        <path d="M28,35 C22.4771525,35 18,27.836556 18,19 C18,10.163444 22.4771525,3 28,3" id="路径" stroke="#818187" stroke-linecap="round"/>\n' +
            '                        <rect id="矩形备份-11" fill="#DDDDE1" x="25" y="0" width="10" height="5" rx="2"/>\n' +
            '                        <rect id="矩形备份-12" fill="#DDDDE1" x="25" y="16" width="10" height="5" rx="2"/>\n' +
            '                        <rect id="矩形备份-13" fill="#DDDDE1" x="25" y="32" width="10" height="5" rx="2"/>\n' +
            '                    </g>\n' +
            '                </g>\n' +
            '            </g>\n' +
            '        </g>\n' +
            '    </g>\n' +
            '</svg>',
          func(self,pen){
            let root = meta2d.findOne(pen.mindManager.rootId);
            root.mind.direction = 'left';
            toolBoxPlugin.resetDirection(root,'left',true);
            toolBoxPlugin.resetLinePos(root,true)
            toolBoxPlugin.update(root);
          }
        },
        {
          name:'',
          event:'click',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="76px" height="50px" viewBox="0 0 76 50" version="1.1">\n' +
            '    <title>布局备份 7</title>\n' +
            '    <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
            '        <g id="未固定" transform="translate(-633.000000, -616.000000)">\n' +
            '            <g id="编组-6备份" transform="translate(525.000000, 423.000000)">\n' +
            '                <g id="布局备份-7" transform="translate(108.000000, 193.000000)">\n' +
            '                    <rect id="透明底图" fill="#F8F8FC" x="0" y="0" width="76" height="50" rx="2"/>\n' +
            '                    <g id="编组-3" transform="translate(38.000000, 25.250000) scale(1, -1) rotate(-270.000000) translate(-38.000000, -25.250000) translate(25.750000, 0.750000)">\n' +
            '                        <line x1="6.06363636" y1="25.5" x2="15.5333333" y2="25.5" id="直线-12备份-2" stroke="#818187" stroke-linecap="round"/>\n' +
            '                        <rect id="矩形" stroke="#818187" transform="translate(3.000000, 25.500000) rotate(-90.000000) translate(-3.000000, -25.500000) " x="-3.5" y="23" width="13" height="5" rx="2"/>\n' +
            '                        <path d="M17.8386311,43 C15.0303966,40.513797 13,33.3135934 13,24.8187892 C13,16.7047472 14.8524591,9.77185117 17.465812,7" id="路径" stroke="#818187" stroke-linecap="round"/>\n' +
            '                        <rect id="矩形备份-11" fill="#DDDDE1" transform="translate(22.000000, 44.000000) rotate(-90.000000) translate(-22.000000, -44.000000) " x="17" y="41.5" width="10" height="5" rx="2"/>\n' +
            '                        <rect id="矩形备份-12" fill="#DDDDE1" transform="translate(22.000000, 25.000000) rotate(-90.000000) translate(-22.000000, -25.000000) " x="17" y="22.5" width="10" height="5" rx="2"/>\n' +
            '                        <rect id="矩形备份-13" fill="#DDDDE1" transform="translate(22.000000, 5.000000) rotate(-90.000000) translate(-22.000000, -5.000000) " x="17" y="2.5" width="10" height="5" rx="2"/>\n' +
            '                    </g>\n' +
            '                </g>\n' +
            '            </g>\n' +
            '        </g>\n' +
            '    </g>\n' +
            '</svg>',
          func(self,pen){
            let root = meta2d.findOne(pen.mindManager.rootId);
            root.mind.direction = 'top';
            toolBoxPlugin.resetDirection(root,'top',true);
            toolBoxPlugin.resetLinePos(root,true)
            toolBoxPlugin.update(root);
          }
        },
        {
          name:'',
          icon:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="76px" height="50px" viewBox="0 0 76 50" version="1.1">\n' +
            '    <title>布局备份 2</title>\n' +
            '    <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
            '        <g id="未固定" transform="translate(-725.000000, -480.000000)">\n' +
            '            <g id="编组-6备份" transform="translate(525.000000, 423.000000)">\n' +
            '                <g id="布局备份-2" transform="translate(200.000000, 57.000000)">\n' +
            '                    <rect id="透明底图" fill="#F8F8FC" x="0" y="0" width="76" height="50" rx="2"/>\n' +
            '                    <g id="编组-3" transform="translate(38.000000, 25.250000) rotate(-270.000000) translate(-38.000000, -25.250000) translate(25.750000, 0.750000)">\n' +
            '                        <line x1="6.06363636" y1="25.5" x2="15.5333333" y2="25.5" id="直线-12备份-2" stroke="#818187" stroke-linecap="round"/>\n' +
            '                        <rect id="矩形" stroke="#818187" transform="translate(3.000000, 25.500000) rotate(-90.000000) translate(-3.000000, -25.500000) " x="-3.5" y="23" width="13" height="5" rx="2"/>\n' +
            '                        <path d="M17.8386311,43 C15.0303966,40.513797 13,33.3135934 13,24.8187892 C13,16.7047472 14.8524591,9.77185117 17.465812,7" id="路径" stroke="#818187" stroke-linecap="round"/>\n' +
            '                        <rect id="矩形备份-11" fill="#DDDDE1" transform="translate(22.000000, 44.000000) rotate(-90.000000) translate(-22.000000, -44.000000) " x="17" y="41.5" width="10" height="5" rx="2"/>\n' +
            '                        <rect id="矩形备份-12" fill="#DDDDE1" transform="translate(22.000000, 25.000000) rotate(-90.000000) translate(-22.000000, -25.000000) " x="17" y="22.5" width="10" height="5" rx="2"/>\n' +
            '                        <rect id="矩形备份-13" fill="#DDDDE1" transform="translate(22.000000, 5.000000) rotate(-90.000000) translate(-22.000000, -5.000000) " x="17" y="2.5" width="10" height="5" rx="2"/>\n' +
            '                    </g>\n' +
            '                </g>\n' +
            '            </g>\n' +
            '        </g>\n' +
            '    </g>\n' +
            '</svg>',
          event:'click',
          func(self,pen){
            let root = meta2d.findOne(pen.mindManager.rootId);
            root.mind.direction = 'bottom';
            toolBoxPlugin.resetDirection(root,'bottom',true);
            toolBoxPlugin.resetLinePos(root,true)
            toolBoxPlugin.update(root);
          }
        },
      ],
      setChildrenDom(self){
        let dom = createDom('div',{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          position:'absolute',
          visibility:'hidden',
          top:'38px',
          backgroundColor:'#fff',
          borderRadius:'5px',
          padding:'3px',
          width: '185px',
          boxShadow: '0px 6px 20px rgba(25,25,26,.06), 0px 2px 12px rgba(25,25,26,.04)',
        });
        return dom ;
      }
    }
  ]
};
