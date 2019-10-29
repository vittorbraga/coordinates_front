import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import leaflet from 'leaflet';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  base_url = "http://192.168.0.100:3000/";

  map: any;
  public center:leaflet.PointTuple;

  constructor(public navCtrl: NavController, public http: Http) {
    this.center= [50.3734961443035, -106.08398437500001];
  }

  ionViewDidEnter(){
    this.leafletMap();
  }

  leafletMap(){
    var that = this;

    this.map=leaflet.map('mapId', {
      center: this.center,
      zoom: 4
    });

    var position =leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(this.map);

    // var marker = new leaflet.Marker(this.center);
    // this.map.addLayer(marker);

    // marker.bindPopup("<p> Leaflet Mapa Funcionando. </p>");
    this.getCoordinates();

    this.map.on('click', function(e) {
      console.log(e);
      var popLocation= e.latlng;

      var marker = new leaflet.Marker([popLocation.lat, popLocation.lng]);
      that.map.addLayer(marker);
      marker.bindPopup("<p>"+popLocation.lat+" "+popLocation.lng+"</p>");
      that.postCoordinate(popLocation);
  });
  }

  getCoordinates(){
    this.http.get(this.base_url+"coordinates/")
      .subscribe((result: any) => {
        JSON.parse(result._body).forEach(position => {
          console.log(position);
          if(!isNaN(position.lat) && !isNaN(position.lng)){
            var marker = new leaflet.Marker([position.lat, position.lng]);
            this.map.addLayer(marker);
            marker.bindPopup("<p>"+position.lat+" "+position.lng+"</p>");
          }
        });
      },
      (error) => {
        console.log(error);
      });
  }

  postCoordinate(position){
    this.http.post(this.base_url+"coordinates/", position)
      .subscribe((result: any) => {
        console.log(result);
      },
      (error) => {
        alert("Falha ao salvar as coordenadas!");
      })
  }
}
