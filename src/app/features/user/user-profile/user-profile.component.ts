import { Component, inject, OnInit } from '@angular/core';
import { TokenService } from '../../../shared/services/token.service';
import { ProfileUserDto } from '../../../shared/models/ProfileUserDto';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  private tokenService = inject(TokenService);
  userProfile: any;
  constructor() { }

  ngOnInit() {
    this.userProfile = this.tokenService.getProfileUserDto();
    console.log(this.userProfile);
  }

}
