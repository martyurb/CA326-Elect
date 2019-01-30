import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/not-auth.guard';
import { SigninComponent } from './signin/signin.component';

const appRoutes: Routes = [
    { path: 'signin', component: SigninComponent, canActivate: [NotAuthGuard]},
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes
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