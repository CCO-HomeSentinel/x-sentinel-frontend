import { mapToCanActivate, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './services/auth/guard/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component : LoginComponent },
    { path: 'dashboard', component : HomeComponent, canActivate: [AuthGuard] }
];