import { Component, OnInit } from '@angular/core';
import {init as initApm} from "@elastic/apm-rum";
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

const apmData = {
  serviceName: 'RUM-UI', // specify service name for RUM
  projectName: 'RUM-Proj', // provide the snappyflow project name from step 4
  appName: 'RUM-grouping-test', // provide the snappyflow application name from step 4
};

const apm = initApm({

  // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
  serviceName: apmData.serviceName,

  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl: 'https://add-component-test-sf-lb-8fd0571029bb08f5.elb.us-west-2.amazonaws.com:8200',
  distributedTracing: false,
  breakdownMetrics: true,
  session: true
})

apm.addLabels({ '_tag_appName': apmData.appName });
apm.addLabels({ '_tag_projectName': apmData.projectName });
apm.addLabels({ '_tag_profileId': '9bnoa130' });
apm.addLabels({ '_tag_agent': 'rum' });

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.authService.appUser$.subscribe(user => {
      if (!user) {
        return;
      } else {
        /*
         * If the user is logged in fetch the return URL from local storage.
         * Navigate to the return URL if available.
         */
        const returnUrl = localStorage.getItem('returnUrl');
        if (!returnUrl) {
          return;
        }
        localStorage.removeItem('returnUrl');
        this.router.navigateByUrl(returnUrl);
      }
    });
  }
}
