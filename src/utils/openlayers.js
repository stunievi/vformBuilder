/**
 * Openlayers
 * @module utils/openlayer
 */
import 'ol/ol.css'
import {get, transform} from 'ol/proj'
import {getWidth, getTopLeft} from 'ol/extent'
import {Atlas, AtlasManager, Circle, Fill, Icon, IconImage, Image, RegularShape, Stroke, Style, Text} from 'ol/style'
import TileGrid from 'ol/tilegrid/TileGrid'
import WMTSGrid from 'ol/tilegrid/WMTS'

import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'

import XYZ from 'ol/source/XYZ'
import WMTS from 'ol/source/WMTS'
import VectorSource from 'ol/source/Vector'
import TileImage from 'ol/source/TileImage'

import Map from 'ol/Map'
import View from 'ol/View'
import Feature from 'ol/Feature'
import Overlay from 'ol/Overlay'
// import Draw from 'ol/interaction/Draw';
import {Draw, Modify} from 'ol/interaction.js';

import Point from 'ol/geom/Point'
import LineString from 'ol/geom/LineString'


/**
 * 创建百度地图图层
 * @private
 */
function createBaiduLayer() {
  const projection = get('EPSG:3857')
  
  const tileGrid = new TileGrid({
    origin: [0, 0],
    resolutions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
      .map(function (x) {
        return Math.pow(2, 18 - x)
      })
  });
  let source = new TileImage({
    projection: projection,
    tileGrid: tileGrid,
    tileUrlFunction: function (tileCoord) {
      const z = tileCoord[0];
      const x = tileCoord[1];
      const y = tileCoord[2];
      const index = Math.ceil(Math.random() * 5)
      return `http://online${index}.map.bdimg.com/onlinelabel/?qt=tile&x=${x}&y=${y}&z=${z}&styles=pl&udt=20170301&scaler=1&p=1`;
    }
  });
  
  return new TileLayer({
    source: source
  })
  
}

/**
 * 创建Google离线地图图层
 * @private
 * @param {string} basePath 服务器瓦片地址前缀，如：http://172.19.40.108:8081/maptile/googlemaps/roadmap/
 */
function createGoogleOfflineLayer(basePath) {
  return new TileLayer({
    source: new XYZ({
      url: `${basePath}/{z}/{x}/{y}.png`
    })
  })
}

/**
 * 创建PGIS地图图层，由于跨域，需要做瓦片代理服务器
 * @private
 * @param {string} basePath 服务器瓦片地址前缀，如：http://127.0.0.1:3000/proxy?MAP=PGIS&LAYERS=sl2015
 * @param {Object} view
 */
function createPGISLayer(basePath, view) {
  const tileSizePixels = 256
  const projection = get('EPSG:4326')
  const projectionExtent = projection.getExtent();
  const size = getWidth(projectionExtent) / tileSizePixels
  let matrixIds = [];
  let resolutions = [];
  for (let i = 0; i <= 20; i++) {
    matrixIds[i] = i;
    resolutions[i] = size / Math.pow(2, i);
  }
  const tileGrid = new WMTSGrid({
    origin: getTopLeft(projectionExtent),
    resolutions: resolutions,
    matrixIds: matrixIds
  });
  return new TileLayer({
    source: new WMTS({
      url: basePath,
      tileGrid: tileGrid,
      projection: projection,
      tileLoadFunction: function (imageTile, src) {
        const tileCoord = imageTile.tileCoord;
        let zoom = tileCoord[0];
        let col = tileCoord[1];
        let row = -(tileCoord[2] + 1);
        imageTile.getImage().src = `${basePath}?Service=getImage&Type=RGB&ZoomOffset=0&Col=${col}&Row=${row}&Zoom=${zoom}&V=0.3`;
      }
    }),
    wrapX: false
  })
}

/**
 * style json对象解析，通过传入json格式数据解析成Style实例
 * @param {Object} options ,json数据，去匹配转化成Style实例,
 * 其中每个实例节点需要有className属性，为字符串，className包括:
 * Atlas/AtlasManager/Circle/Fill/Icon/IconImage/Image/RegularShape/Stroke/Style/Text
 * 分别匹配Style对应的对象实例，其余属性，为对象实例化时传入的对象；
 * 如果没有包含className的对象属性，则直接返回该对象。
 * 如：{
 *   className: 'Style',
 *   fill: {
 *     className: 'Fill',
 *     color: 'rgba(255, 255, 255, 0.2)'
 *   },
 *   stroke: {
 *     className: 'Stroke',
 *     color: '#ffcc33',
 *     width: 2
 *   },
 *   image: {
 *     className: 'Circle',
 *     radius: 7,
 *     fill: {
 *       className: 'Fill',
 *       color: '#ffcc33'
 *     }
 *   }
 * }
 * 解析后等同于
 *  new Style({
 *    fill: new Fill({
 *      color: 'rgba(255, 255, 255, 0.2)'
 *    }),
 *    stroke: new Stroke({
 *      color: '#ffcc33',
 *      width: 2
 *    }),
 *    image: new Circle({
 *      radius: 7,
 *      fill: new Fill({
 *        color: '#ffcc33'
 *      })
 *    })
 *  })
 */

function parseStyle(options) {
  if (options && options.className && StyleMap[options.className]) {
    let childOptions = {};
    Object.keys(options).map(v => {
      if (v !== 'className') {
        if (typeof options[v] === 'object' && options[v].className) {
          childOptions[v] = parseStyle(options[v]);
        } else {
          childOptions[v] = options[v];
        }
      }
    });
    return new StyleMap[options.className](childOptions)
  }
}

function getFeatureAtPixel(map, pixel) {
  return map.forEachFeatureAtPixel(pixel, function (feature) {
    return feature
  })
}


function bindEvents(map, features, events) {
  const eventsArray = Object.keys(events)
  let __events = {}
  
  eventsArray.forEach(key => {
    __events[key] = (e) => {
      const feature = getFeatureAtPixel(map, e.pixel)
      if (feature && features.includes(feature)) {
        let coordinates = feature.getGeometry().getCoordinates()
        events[key]({
          coords: coordinates,
          loc: transform(coordinates, 'EPSG:3857', 'EPSG:4326'),
          feature: feature,
          event: e,
          data: feature.__data,
          name: feature.__name || feature.name || ''
        })
      }
    }
    map.on(key, __events[key])
  })
  return __events
}

function addLayer(map, feature) {
  const features = [].concat(feature)
  let vectorSource = new VectorSource({
    features: features
  })
  let vectorLayer = new VectorLayer({
    source: vectorSource
  })
  map.addLayer(vectorLayer)
  return vectorLayer
}

/**
 * 地图图层创建方法映射
 * @type {Object}
 */
const mapCreators = {
  baidu: createBaiduLayer,
  google: createGoogleOfflineLayer,
  pgis: createPGISLayer
}

const StyleMap = {Atlas, AtlasManager, Circle, Fill, Icon, IconImage, Image, RegularShape, Stroke, Style, Text}
/**
 * 默认参数选项对象
 */
const defaultOptions = {
  /**
   * 地图类型，可选：baidu / google / pgis
   */
  type: 'baidu',
  /**
   * 初始化中心点经纬度坐标
   */
  center: [104.393345, 36.521576],
  /**
   * 初始缩放等级
   */
  zoom: 5,
  /**
   * 最小可缩放等级
   */
  minZoom: 1,
  /**
   * 最大可缩放等级
   */
  maxZoom: 20,
  /**
   * google离线地图 或 PGIS地图需要指定瓦片服务器路径
   * 如：
   * http://172.19.40.108:8081/maptile/googlemaps/roadmap/
   * http://127.0.0.1:3000/proxy?MAP=PGIS&LAYERS=sl2015
   */
  path: '',
  
  /**
   * 初始化自定义图层创建函数
   */
  layerCreator: null,
  
  projection: 'EPSG:4326'
}

/**
 * Openlayers 类
 * @class
 */
class Openlayers {
  /**
   * 构造函数
   * @constructor
   * @param {HTMLElement} el 地图的容器元素对象
   * @param {Object} options 配置参数选项
   * @param {string} [options.type=baidu] 地图类型， 可选：baidu / google / pgis
   * @param {Array} [options.center] 地图初始化中心位置经纬度，默认： [104.393345, 36.521576]
   * @param {Number} [options.zoom=5] 初始化缩放等级
   * @param {Number} [options.minZoom=1] 最小缩放等级
   * @param {Number} [options.maxZoom=1] 最大缩放等级
   * @param {String} [options.path] 瓦片服务器路径, google离线地图和PGIS地图需要指定
   */
  constructor(el, options) {
    if (!el) throw new Error('missing el param')
    
    this.el = el
    let o = this.options = {
      ...defaultOptions,
      ...(options || {})
    }
    const view = new View({
      center: o.center,
      zoom: o.zoom,
      minZoom: o.minZoom,
      maxZoom: o.maxZoom,
      projection: o.projection
    })
    
    const layerCreator = mapCreators[o.type] || o.layerCreator || createBaiduLayer
    this.map = new Map({
      target: this.el,
      layers: [layerCreator(o.path, view, TileLayer)],
      view: view,
      controls: null
    })
  }
  
  /**
   * 销毁地图
   */
  destroy() {
    this.map.disposeInternal()
  }
  
  /**
   * 重置地图尺寸，当容器的尺寸变化后需要执行resize
   */
  resize() {
    this.map.updateSize()
  }
  
  /**
   * 设置地图缩放等级
   * @param {Number} level 等级数值
   */
  zoom(level) {
    const view = this.map.getView()
    view.animate({
      zoom: Number.parseInt(level)
    })
  }
  
  /**
   * 逐步放大
   */
  zoomIn() {
    const view = this.map.getView()
    this.zoom(view.getZoom() + 1)
  }
  
  /**
   * 逐步缩小
   */
  zoomOut() {
    const view = this.map.getView()
    this.zoom(view.getZoom() - 1)
  }
  
  /**
   * 平移地图
   * @param {Number} [x=0] 水平方向移动, 正数向右，负数向左
   * @param {Number} [y=0] 垂直方向移动, 正数向上，负数向下
   */
  move(x = 0, y = 0) {
    const view = this.map.getView();
    let mapCenter = view.getCenter()
    let lon = mapCenter[0]
    let lat = mapCenter[1]
    lon -= x
    lat -= y
    mapCenter[0] = lon > -180 ? (lon < 180 ? lon : 180) : -180
    mapCenter[1] = lat > -90 ? (lat < 90 ? lat : 90) : -90
    view.animate({
      center: transform(mapCenter, 'EPSG:4326', 'EPSG:3857')
    })
  }
  
  /**
   * 移动到指定经纬度居中
   * @param {Array} loc 经纬度数组
   */
  moveTo(loc) {
    const view = this.map.getView()
    view.animate({
      center: loc
    })
  }
  
  /**
   * 在地图上打标记
   * @param {object|array} options 标记配置参数选项，支持数组创建多个标记
   * @param {array} [options.loc] 经纬度
   * @param {string} [options.name] 标记名称
   * @param {string} [options.icon] 图表图片路径
   * @param {number} [options.scale] 设置缩放比例
   * @param {array} [options.anchor] 图表偏移，默认：[0.5, 40]
   * @param {object} events 对标记绑定的事件
   * @return {VectorLayer} 标记所在的图层
   *
   * @example
   *
   * marker([{
   *      loc: [104.393345, 36.521576],
   *      name: 'name',
   *      icon: require('@/widgets/xdh-map/images/case.png')
   *    }], {
   *      click: (evt) => {
   *       // do something...
   *      }
   *    }
   */
  marker(options, events = {}) {
    if (!options) throw new Error('miss options param')
    const optionsArray = Array.isArray(options) ? options : [options]
    const features = optionsArray.map(item => {
      let iconFeature = new Feature({
        geometry: new Point(item.loc),
        name: item.name
      })
      let iconStyle = new StyleMap.Style({
        image: new StyleMap.Icon({
          src: item.icon,
          anchor: item.anchor || [0.5, 40],
          scale: item.scale || 1,
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels'
        })
      })
      iconFeature.setStyle(iconStyle)
      iconFeature.__data = item
      iconFeature.__name = 'marker'
      return iconFeature
    })
    let vectorLayer = addLayer(this.map, features)
    const __events = bindEvents(this.map, features, events)
    // 在图层对象上记录绑定的事件句柄，方便销毁
    vectorLayer.__events = __events
    return vectorLayer
  }
  
  /**
   * 根据地图上的像素位置获取图形对象
   * @param  {Array} pixel 位置像素 [x,y]
   * @return {module:ol/Feature|module:ol/render/Feature|*}
   */
  getFeatureAtPixel(pixel) {
    return getFeatureAtPixel(this.map, pixel)
  }
  
  /**
   * 删除地图上的元素，如：图层、覆盖物
   * @param {Object} obj 需要删除的对象
   * @return {boolean}
   */
  remove(obj) {
    if (obj instanceof Overlay) {
      this.map.removeOverlay(obj)
      return true
    }
    // 由于在VectorLayer的实例写入 __events，用instanceof判断不了类型，改用type属性来判断
    if (obj instanceof VectorLayer || obj.type === 'VECTOR') {
      let events = obj.__events || {}
      Object.keys(events).forEach(key => {
        this.map.un(key, events[key])
      })
      this.map.removeLayer(obj)
      return true
    }
    return false
  }
  
  /**
   * 创建气泡窗体
   * @param {HTMLElement} element 气泡的DOM容器
   * @param {Object} options 配置参数选项
   * @param {string} [options.positioning] 定位位置，默认：bottom-center
   * @param {Boolean} [options.stopEvent=false]  阻止事件冒泡
   * @param {Array} [options.offset] 显示位置偏移 默认： [0, -50]
   * @return {Overlay}
   *
   * @example
   *
   * let popup = openlayers.popup(el)
   *
   * 显示方法： popup.setPosition(coordinates)
   * 隐藏方法： popup.setPosition(null)
   */
  popup(element, options) {
    const opts = Object.assign({
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -50]
    }, options || {}, {
      element: element
    })
    let popup = new Overlay(opts);
    this.map.addOverlay(popup)
    return popup
  }
  
  /**
   * 清除地图覆盖物
   */
  clear() {
    const layers = this.map.getLayers()
    layers.forEach(layer => {
      // 删除非瓦片的图层
      if (!(layer instanceof TileLayer)) {
        let events = layer.__events || {}
        Object.keys(events).forEach(key => {
          this.map.un(key, events[key])
        })
        this.map.removeLayer(layer)
      }
    })
    const overlays = this.map.getOverlays()
    overlays.clear()
  }
  
  /**
   * 经纬度转换函数
   * @return {module:ol/coordinate~Coordinate}
   */
  transform() {
    return transform.apply(this, arguments)
  }
  
  /**
   * 转换成标准经纬度
   * @param {Array} coordinates 坐标
   * @return {module:ol/coordinate~Coordinate}
   */
  toLonLat(coordinates) {
    return transform(coordinates, 'EPSG:3857', 'EPSG:4326')
  }
  
  /**
   * 计算两经纬度坐标点距离，
   * @param {Array} coor1 标准经纬度坐标数组,如：[113.38585096783513, 22.96213834599851]；
   * @param {Array} coor2 标准经纬度坐标数组,如：[113.38585096783513, 22.96213834599851]；
   * @return {Number} 返回距离，单位为km；
   */
  getDistance(coor1, coor2) {
    let radLat1 = coor1[0] * Math.PI / 180.0;
    let radLat2 = coor2[0] * Math.PI / 180.0;
    let a = radLat1 - radLat2;
    let b = coor1[1] * Math.PI / 180.0 - coor1[1] * Math.PI / 180.0;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
  }
  
  /**
   * 创建绘画图层，返回图层实例
   * @param {String} type 绘画图形类型，如Point/LineString/Polygon/Circle/None，默认类型为LineString
   * @param {Object}  style 图形样式JSON格式描述；
   * @param {Function} callback 图形创建完成回调函数，参数：'drawend'事件参数；
   * @param {Object}  options 其他相关的配置选项，参考Draw 实例化参数；
   * @return {Object} 返回VectorLayer对象实例和Draw对象实例；
   */
  draw(type, style, callback, options) {
    let source = new VectorSource({wrapX: false});
    let vector = new VectorLayer({
      source: source
    });
    let draw = new Draw({
      source: source,
      type: type || 'LineString',
      style: parseStyle(style),
      ...options
    });
    
    this.map.addLayer(vector);
    this.map.addInteraction(draw);
    draw.once('drawend', (e) => {
      callback && callback(e)
      this.map.removeInteraction(draw);
    });
    return vector
  }
  
  /**
   * 创建并添加图型更新对象Modify，返回Modify对象实例
   * @param {Object} source 更新图形源，如VectorSource实例;
   * @param {Function} callback 图形创建完成回调函数，参数：'modifyend'事件参数；
   * @param {Object} options 其他相关的配置选项，参考Modify 实例化参数；
   * @return {Object} 返回Modify对象实例；
   */
  modify(source, callback, options) {
    let modify = new Modify({source: source, ...options});
    if (callback) {
      modify.once('modifyend', callback);
    }
    this.map.addInteraction(modify);
    return modify;
  }
  
  /**
   * 创建文本
   * @param {Object} [options] 选项
   * @param {Number[]} [options.loc] 经纬度
   * @param {string} [options.text] 文本内容
   * @param {string} [options.color] 字体颜色
   * @param {string} [options.background] 背景颜色
   * @param {string} [options.border] 边框颜色
   * @param {Array} [options.offset] 位置偏移
   * @param {number} [options.padding] 内边距
   * @param {object} events 对标记绑定的事件
   */
  text(options = {}, events = {}) {
    const defaultOptions = {
      text: '',
      loc: [],
      color: '#333',
      background: '#fff',
      border: '#999',
      padding: [3, 3, 3, 3],
      offset: [0, 0]
    }
    const optionsArray = Array.isArray(options) ? options : [options]
    const features = optionsArray.map(item => {
      const opt = {...defaultOptions, ...item}
      const feature = new Feature({
        geometry: new Point(opt.loc)
      })
      const style = new Style({
        text: new Text({
          text: String(opt.text),
          fill: new Fill({
            color: opt.color
          }),
          backgroundFill: new Fill({
            color: opt.background
          }),
          backgroundStroke: new Stroke({
            color: opt.border
          }),
          padding: opt.padding,
          offsetX: opt.offset[0],
          offsetY: opt.offset[1]
        })
      })
      feature.__data = item
      feature.__name = 'text'
      feature.setStyle(style)
      return feature
    })
    let vectorLayer = addLayer(this.map, features)
    const __events = bindEvents(this.map, features, events)
    // 在图层对象上记录绑定的事件句柄，方便销毁
    vectorLayer.__events = __events
    return vectorLayer
  }
  
  /**
   * 在地图上画线
   * @param {Array} coords 坐标二维数组
   * @param {Object} style Style配置JSON
   * @return {Layer} layer
   *
   * @example
   *      const layer = ol.line([[104.393345, 36.521576], [106.493345, 39.621576]], {
   *        className: 'Style',
   *        stroke: {
   *          className: 'Stroke',
   *          width: 5,
   *          color: '#ff0000'
   *        }
   *      })
   */
  line(coords = [], style = {}) {
    if (coords.length === 0) return
    // const lonLat = coords.map(n => fromLonLat(n))
    const feature = new Feature({
      geometry: new LineString(coords)
    })
    feature.setStyle(parseStyle(style))
    return addLayer(this.map, feature)
  }
  
  /**
   * 在地图上画点
   * @param {Array} coord 坐标
   * @param {Object} style Style配置JSON
   * @return {Layer} layer
   *
   * @example
   *   ol.point([106.493345, 39.621576], {
   *           className: 'Style',
   *           image: {
   *             className: 'Icon',
   *             src: require('@/widgets/xdh-map/images/case.png'),
   *             color: '#ff0000'
   *           }
   *         })
   */
  point(coord = [], style = {}) {
    const feature = new Feature({
      geometry: new Point(coord)
    })
    feature.setStyle(parseStyle(style))
    return addLayer(this.map, feature)
  }
  
  
  /**
   * 在地图上画多个点
   * @param {Array} coords 坐标数组
   * @param {Object} style Style配置JSON
   * @return {Layer} layer
   *
   * @example
   *   ol.point([[106.493345, 39.621576],...], {
   *           className: 'Style',
   *           image: {
   *             className: 'Icon',
   *             src: require('@/widgets/xdh-map/images/case.png'),
   *             color: '#ff0000'
   *           }
   *         })
   */
  points(coords = [], style = {}) {
    const styles = [].concat(style)
    const features = coords.map((n, i) => {
      const feature = new Feature({
        geometry: new Point(n)
      })
      feature.setStyle(styles[i] || style)
      return feature
    })
    return addLayer(this.map, features)
  }
}

export default Openlayers
