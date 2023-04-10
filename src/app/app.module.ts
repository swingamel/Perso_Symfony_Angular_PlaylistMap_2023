import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { ListPlaylistComponent } from './list-playlist/list-playlist.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { ChoosePlaylistComponent } from './choose-playlist/choose-playlist.component';
import { HeaderComponent } from './header/header.component';
import { VideoPlayerComponent } from './video-player/video-player.component';

import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from "@angular/forms";
import { ArtistAlbumsComponent } from './artist-albums/artist-albums.component';
import { AlbumComponent } from './album/album.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'search', component: SearchComponent },
  { path: 'list-playlist', component: ListPlaylistComponent },
  { path: 'playlist/:id', component: PlaylistComponent },
  { path: 'choose-playlist', component: ChoosePlaylistComponent },
  { path: 'video-player/:id', component: VideoPlayerComponent},
  { path: 'artist-details/:id', component: ArtistAlbumsComponent },
  { path: 'album/:id', component: AlbumComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ListPlaylistComponent,
    PlaylistComponent,
    ChoosePlaylistComponent,
    HeaderComponent,
    VideoPlayerComponent,
    ArtistAlbumsComponent,
    AlbumComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
