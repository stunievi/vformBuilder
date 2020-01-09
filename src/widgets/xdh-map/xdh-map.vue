<template>
  <div class="xdh-map__wrapper">
    <div ref="map" class="xdh-map"></div>
    <slot></slot>
    <!--<div class="xdh-map__loc" v-if="pointerLocation.length>0">{{pointerLocation.join(', ')}}</div>-->
  </div>
</template>

<script>
  import Openlayers from '@/utils/openlayers'
  import {addResizeListener, removeResizeListener} from 'element-ui/lib/utils/resize-event'

  export default {
    name: 'xdh-map',
    props: {
      type: {
        type: String,
        default: 'baidu'
      },
      center: {
        type: Array,
        default() {
          return [104.393345, 36.521576]
        }
      },
      zoom: {
        type: Number,
        default: 5
      },
      maxZoom: {
        type: Number,
        default: 18
      },
      minZoom: {
        type: Number,
        default: 1
      },
      path: {
        type: String
      }
    },
    data() {
      return {
        ol: null,
        popup: null,
        pointerLocation: []
      }
    },
    methods: {
      handlePointerMove() {
        const coords = this.ol.map.getEventCoordinate(event)
        this.pointerLocation = this.ol.toLonLat(coords)
      },
      resize() {
        this.ol && this.ol.resize()
      }
    },
    mounted() {
      this.ol = new Openlayers(this.$refs.map, {
        type: this.type,
        center: this.center,
        zoom: this.zoom,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        path: this.path
      })

      this.proxyResize = this.resize.bind(this)

      this.ol.map.on('pointermove', this.handlePointerMove.bind(this))
      addResizeListener(this.$el, this.proxyResize)
      this.$emit('on-ready', this.ol, this.ol.map)
    },
    beforeDestroy() {
      removeResizeListener(this.$el, this.proxyResize)
      this.map && this.map.destroy()
    }
  }
</script>
