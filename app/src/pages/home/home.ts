import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PubNubAngular } from 'pubnub-angular2';
import { ToastController } from 'ionic-angular';

import { Message } from './model';
import { BLE } from '@ionic-native/ble';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //BLE
  devices: any[] = [];
  statusMessage: string;

  //PUBNUB
  message : Message = [];

  constructor(public navCtrl: NavController,
              private ble: BLE,
              private ngZone: NgZone,
              private toastCtrl: ToastController, 
              public pubnub: PubNubAngular) {
              
    //PUBNUB             
    pubnub.init({
      publishKey: 'pub-c-e8c3fb0e-1f41-4b92-a3e5-30cb96805ed7',
      subscribeKey: 'sub-c-e9f3f922-b32d-11e7-a852-92b7c98bd364'
    });

    let self = this;

    // Publish to a channel
    /*pubnub.publish(
            {
                message: {such: 'Ionic side'},
                channel: 'shoes'
            },
            (status, response) => {
                if (status.error) {
                    console.log(status);
                } else {
                    console.log('message Published w/ timetoken', response.timetoken);
                }
            }
        );*/

    // Subscribe to a channel
    pubnub.addListener({
  
        status: function(statusEvent) {
            if (statusEvent.category === "PNUnknownCategory") {
                var newState = {
                    new: 'error'
                };
                pubnub.setState(
                    { 
                        state: newState 
                    }, 
                    function (status) {
                        console.log(statusEvent.errorData.message)
                    }
                );
            }
        },
        message: function(msg) {
            self.message = msg['message'];
            console.log(self.message)
        }
    })
    
    pubnub.subscribe({
        channels: ['shoes']
    });
  }

  //BLE
    scan() {
        this.setStatus('Scanning for Bluetooth LE Devices');
        this.devices = [];  // clear list
        this.ble.scan([], 5).subscribe(
            device => this.onDeviceDiscovered(device), 
            error => this.scanError(error)
        );

        setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
    }

    onDeviceDiscovered(device) {
        console.log('Discovered ' + JSON.stringify(device, null, 2));
        this.ngZone.run(() => {
        this.devices.push(device);
        });
    }

    // If location permission is denied, you'll end up here
    scanError(error) {
        this.setStatus('Error ' + error);
        let toast = this.toastCtrl.create({
        message: 'Error scanning for Bluetooth low energy devices',
        position: 'middle',
        duration: 5000
        });
        toast.present();
    }

    setStatus(message) {
        console.log(message);
        this.ngZone.run(() => {
        this.statusMessage = message;
        });
    }

  SendMessage() {}
  
}
