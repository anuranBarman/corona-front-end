import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import * as CanvasJS from './canvas.js';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  latestData;
  latestDataIndia = {
    confirmed: 0,
    recovered: 0,
    deaths: 0
  }
  loading = true;
  loadingIndia = true;
  lastUpdatedAt;

  constructor() {

  }

  renderChart() {
    let chart = new CanvasJS.Chart("chartContainer", {
      theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "World Wide"
      },
      data: [{
        type: "pie",
        showInLegend: true,
        toolTipContent: "<b>{name}</b>: {y} (#percent%)",
        indexLabel: "{name} - #percent%",
        dataPoints: [
          { y: this.latestData.confirmed, name: "Confirmed" },
          { y: this.latestData.recovered, name: "Recovered" },
          { y: this.latestData.deaths, name: "Deaths" },
        ]
      }]
    });

    chart.render();
  }

  renderChartIndia() {
    let chart = new CanvasJS.Chart("chartContainer2", {
      theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "India"
      },
      data: [{
        type: "pie",
        showInLegend: true,
        toolTipContent: "<b>{name}</b>: {y} (#percent%)",
        indexLabel: "{name} - #percent%",
        dataPoints: [
          { y: this.latestDataIndia.confirmed, name: "Confirmed" },
          { y: this.latestDataIndia.recovered, name: "Recovered" },
          { y: this.latestDataIndia.deaths, name: "Deaths" },
        ]
      }]
    });

    chart.render();
  }

  getLastTime() {
    return moment(this.lastUpdatedAt).fromNow();
  }

  ngOnInit(): void {
    axios.get('https://coronavirus-tracker-api.herokuapp.com/all')
      .then(response => {
        this.loading = false;
        this.loadingIndia = false;
        if (response.data) {
          this.latestData = response.data.latest;
          this.lastUpdatedAt = response.data.confirmed.last_updated;

          var locations = response.data.confirmed.locations.filter(loc => {
            return loc.country_code == "IN"
          })
          if (locations.length > 0) {
            this.latestDataIndia["confirmed"] = locations[0].latest;
          }

          var locations2 = response.data.recovered.locations.filter(loc => {
            return loc.country_code == "IN"
          })
          if (locations2.length > 0) {
            this.latestDataIndia["recovered"] = locations2[0].latest;
          }

          var locations3 = response.data.deaths.locations.filter(loc => {
            return loc.country_code == "IN"
          })
          if (locations3.length > 0) {
            this.latestDataIndia["deaths"] = locations3[0].latest;
          }

          this.renderChart();
          this.renderChartIndia();
        } else {
          console.log(response);
        }
      }).catch(err => {
        console.log(err);
        this.loading = false;
        this.loadingIndia = false;
      })
  }

}
