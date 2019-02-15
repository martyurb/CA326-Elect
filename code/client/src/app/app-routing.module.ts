import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/not-auth.guard';
import { SigninComponent } from './signin/signin.component';
import { AccountComponent } from './account/account.component';
import { ManageKeysComponent } from './manage-keys/manage-keys.component';
import { PollComponent } from './poll/poll.component';
import { ViewPollComponent } from './view-poll/view-poll.component';
import { HomeComponent } from './home/home.component';
import { UserPollsComponent } from './user-polls/user-polls.component';
import { CastVoteComponent } from './cast-vote/cast-vote.component';
import { ResultsComponent } from './results/results.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'signin', component: SigninComponent, canActivate: [NotAuthGuard] },
    { path: 'user/account', component: AccountComponent, canActivate: [AuthGuard] },
    { path: 'users/keys', component: ManageKeysComponent, canActivate: [AuthGuard] },
    { path: 'poll/create', component: PollComponent, canActivate: [AuthGuard] },
    { path: 'poll/:id', component: ViewPollComponent, canActivate: [AuthGuard] },
    { path: 'user/polls', component: UserPollsComponent, canActivate: [AuthGuard] },
    { path: 'poll/:id/cast', component: CastVoteComponent, canActivate: [AuthGuard] },
    { path: 'poll/:id/result', component: ResultsComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
        )
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthGuard,
        NotAuthGuard
    ]
})

export class AppRoutingModule { }
