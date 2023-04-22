import Map from 'ol/Map.js';
import Overlay from 'ol/Overlay.js';
import OSM, { ATTRIBUTION } from 'ol/source/OSM.js';
import Tile from 'ol/layer/Tile.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import LayerGroup from 'ol/layer/Group.js';
import Stamen from 'ol/source/Stamen.js';
import {toLonLat} from 'ol/proj.js';
import XYZ from 'ol/source/XYZ.js';
import {toStringHDMS} from 'ol/coordinate.js';

/**
 * 构成弹出窗口的元素
 */
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

/**
 * 创建一个叠加层以将弹出窗口锚定到地图上
 */
const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

/**
 * 添加点击处理程序以隐藏弹出窗口
 * @return {boolean} 不要关注 href
 */
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};


//加载初始标准地图
const map = new Map({
  target: 'map',
  overlays: [overlay],
  view: new View({
    center: [12153494.776357276, 4076801.3198558404],//这个位置是西安
    zoom: 3.5,
  }),
});

//地图类型
const openStreetMapstandard = new TileLayer({
  source: new OSM(),
  visible: true,
  title: 'OSMStandard'
})

const stamenTerrain = new TileLayer({
  source: new Stamen({
    layer: 'terrain'
  }),
  visible: false,
  title: 'StamenTerrain'
})

const ordinaryMap = new TileLayer({
  source: new XYZ({
    // 无地形
    url: "http://t2.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=5c5b12c8441e157121ce19c6d6417460"
  }),
  visible: false,
  title: 'OrdinaryMap'
})

const terrainMap = new TileLayer({
  source: new XYZ({
    // 有地形
    url: 'http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=5c5b12c8441e157121ce19c6d6417460',
  }),
  visible: false,
  title: 'TerrainMap'
})

const tileMark1 = new TileLayer({
  source: new XYZ({
    url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=5c5b12c8441e157121ce19c6d6417460'
  }),
  visible: false,
  title: 'OrdinaryMap'
})

const tileMark2 = new TileLayer({
  source: new XYZ({
    url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=5c5b12c8441e157121ce19c6d6417460'
  }),
  visible: false,
  title: 'TerrainMap'
})

const baseLayerGroup = new LayerGroup({
  layers:[
    openStreetMapstandard, stamenTerrain, ordinaryMap, terrainMap, tileMark1, tileMark2
  ]
})
map.addLayer(baseLayerGroup);

//地图切换功能
const baseLayerElements = document.querySelectorAll('.sidebar >input[type=radio]')
// console.log(baseLayerElements);
for(let baseLayerElement of baseLayerElements){
  // console.log(baseLayerElements)
  baseLayerElement.addEventListener('change', function(){
    // console.log(this.value)
    let baseLayerElementValue = this.value;
    baseLayerGroup.getLayers().forEach(function(element, index, array){
      let baseLayerTitle = element.get('title');
      element.setVisible(baseLayerTitle === baseLayerElementValue);
    })
  })
}

map.on('singleclick', function (evt) {
  const coordinate = evt.coordinate;
  const hdms = toStringHDMS(toLonLat(coordinate));

  content.innerHTML = '<p>你点击的是:</p><code>' + hdms + '</code>';
  overlay.setPosition(coordinate);
});