import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SpotifyService} from '../services/spotify.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
  album: any;
  songs: any[] = [];

  constructor(private route: ActivatedRoute, private spotifyService: SpotifyService) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (!isNaN(id)) {
        this.spotifyService.getAlbum(id).subscribe((data: any) => {
          this.album = data;
        });
      }
    });
  }
}
