import Vue from 'vue'
import Affix from './xdh-affix'
import Avatar from './xdh-avatar'
import AsyncImg from './xdh-async-img'
import BackTop from './xdh-back-top'
import Box from './xdh-box'
import Curd from './xdh-curd'
import Contextmenu from './xdh-contextmenu'
import Dialog from './xdh-dialog'
import DialogForm from './xdh-dialog-form'
import Dropbox from './xdh-dropbox'
import FilterPanel from './xdh-filter-panel'
import Grid from './xdh-grid'
import IconPicker from './xdh-icon-picker'
import ImagePicker from './xdh-image-picker'
import Layout from './xdh-layout'
import ListPanel from './xdh-list-panel'
import Loading from './xdh-loading'
import Menu from './xdh-menu'
import MenuToggle from './xdh-menu-toggle'
import NavTabs from './xdh-nav-tabs'
import Pager from './xdh-pager'
import Panel from './xdh-panel'
import Scroll from './xdh-scroll'
import Title from './xdh-title'
import Tree from './xdh-tree'
import TreeSelect from './xdh-tree-select'
import TreeTable from './xdh-tree-table'
import TreeTableColumn from './xdh-tree-table-column'
import Window from './xdh-window'
import Echarts from './xdh-echarts/xdh-echarts.vue'
import Go from './xdh-go/xdh-go.vue'
import Capture from './xdh-capture'
import Form from './xdh-form'
import Tabs from './xdh-tabs'
import Select from './xdh-select/xdh-select.vue'
import CountUp from './xdh-countup'
import Table from './xdh-table'
import ImageText from './xdh-image-text'
import Header from './xdh-header'
import Marquee from './xdh-marquee'
import Watermark from './xdh-watermark'
import Print from './xdh-print'
import SlidePanel from './xdh-slide-panel'

import Countdown from './xdh-countdown'
import Ellipsis from './xdh-ellipsis'
import TagSelect from './xdh-tag-select'

import AreaSelector from './xdh-area-selector'
import Flip from './xdh-flip'
import Combo from './xdh-combo'
import XdhList from './xdh-list'
import DescriptionList from './xdh-description-list'
import ChartCard from './xdh-chart-card'
import XdhVirtualScroller from './xdh-virtual-scroller'

Echarts.install = function (Vue) {
  Vue.component(Echarts.name, Echarts)
}
Go.install = function (Vue) {
  Vue.component(Go.name, Go)
}


Vue.use(Affix)
Vue.use(Avatar)
Vue.use(AsyncImg)
Vue.use(BackTop)
Vue.use(Box)
Vue.use(Curd)
Vue.use(Contextmenu)
Vue.use(Dialog)
Vue.use(DialogForm)
Vue.use(Dropbox)
Vue.use(FilterPanel)
Vue.use(Grid)
Vue.use(IconPicker)
Vue.use(ImagePicker)
Vue.use(Layout)
Vue.use(ListPanel)
Vue.use(Loading)
Vue.use(Menu)
Vue.use(MenuToggle)
Vue.use(NavTabs)
Vue.use(Pager)
Vue.use(Panel)
Vue.use(Scroll)
Vue.use(Title)
Vue.use(Tree)
Vue.use(TreeSelect)
Vue.use(TreeTable)
Vue.use(TreeTableColumn)
Vue.use(Window)
Vue.use(Echarts)
Vue.use(Go)
Vue.use(Form)
Vue.use(Capture)
Vue.use(Tabs)
Vue.use(Select)
Vue.use(CountUp)
Vue.use(Table)
Vue.use(ImageText)
Vue.use(Header)
Vue.use(Marquee)
Vue.use(Watermark)
Vue.use(Print)
Vue.use(SlidePanel)

Vue.use(Countdown)
Vue.use(Ellipsis)
Vue.use(TagSelect)
Vue.use(AreaSelector)
Vue.use(Flip)
Vue.use(Combo)
Vue.use(XdhList)
Vue.use(DescriptionList)
Vue.use(ChartCard)
Vue.use(XdhVirtualScroller)
