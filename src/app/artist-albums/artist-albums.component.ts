import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Album, SpotifyService} from '../services/spotify.service';

@Component({
  selector: 'app-artist-albums',
  templateUrl: './artist-albums.component.html',
  styleUrls: ['./artist-albums.component.css']
})
export class ArtistAlbumsComponent implements OnInit {
  artistId: number = 0;
  albums: Album[] = [];

  constructor(private albumService: SpotifyService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.artistId = Number(this.route.snapshot.paramMap.get('id'));
    this.albumService.getArtistAlbums(this.artistId)
      .subscribe(albums => {
        this.albums = albums.filter(album => {
          return album.id.toString() === this.artistId.toString();
        });
        console.log('Albums:', this.albums);
      });
  }

  /*ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let artistId = parseInt(<string>params.get('id'));
      this.apiService.getArtistDetails(artistId).subscribe(
        (response: any) => {
          this.artist = response;
          this.albums = response.albums;
          console.log('Albums:', this.albums);
        },
        error => {
          console.log(error);
        }
      );
    });
  }*/
}
