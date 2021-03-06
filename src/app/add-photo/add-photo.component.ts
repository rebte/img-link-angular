import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImgLinksModel } from '../core/models/img-links.model';
import { GenerationLinkImgService } from '../core/services/generation-link-img.service';

@Component({
  selector: 'app-add-photo',
  templateUrl: './add-photo.component.html',
  styleUrls: ['./add-photo.component.scss']
})

export class AddPhotoComponent implements OnInit {

  form: FormGroup = new FormGroup({
    imgFile: new FormControl('', [Validators.required]),
    url: new FormControl('', [Validators.required, Validators.pattern(/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi)]),
    select: new FormControl('left-right', [Validators.required])
  })

  croppedImage: string
  img: string = ''

  constructor(
    private generationLinkImg: GenerationLinkImgService,
    private router: Router
  ) { }

  handleFileSelect(e): void{
    let files = e.target.files
    let file = files[0]
    if (files && file) {
      let reader = new FileReader()
      reader.onload = this._handleReaderLoaded.bind(this)
      reader.readAsBinaryString(file)
    }
  }

  _handleReaderLoaded(readerEvt): void {
    var binaryString = readerEvt.target.result
    this.img= 'data:image/png;base64,'+btoa(binaryString)
  }

  fileChangeEvent(event: any): void {
    this.croppedImage = event.base64
  }

  submit(): void{
    let obj: ImgLinksModel = {
      base64: this.croppedImage,
      url: this.form.value['url'],
      animation: this.form.value['select']
    }
    this.generationLinkImg.setNewElem(obj)
    this.router.navigate(['../'])
  }
}
