import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {SpotifyService} from "../services/spotify.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";


@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent {
  song: any;
  videoUrl: SafeResourceUrl = '';

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // @ts-ignore
    const id = +this.route.snapshot.paramMap.get('id');
    this.spotifyService.getSong(id).subscribe((data: any) => {
      this.song = data;
      if (this.song && this.song.youtube) {
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.song.youtube.replace("watch?v=", "embed/"));
      }
    });
  }
}
