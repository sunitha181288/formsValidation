import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tutor-app';
  businessTags: string[] = ['Canteen', 'Cafe', 'Charity', 'Pastery', 'Fruits', 'Bevarges'];
  selectedBusinessTags: string[] = [];
  selectedCategory: any;
  businessCategories = [{
    id: 1,
    description: 'Arcades, karkoke, photography',
    shortDesc: 'Arts, photography, entertainment'
  },
  {
    id: 2,
    description: 'Car parts, car servicing, boat servicing',
    shortDesc: 'Automative & boats'
  },
  {
    id: 3,
    description: 'Arcades, karkoke, photography',
    shortDesc: 'Beauty, cosmetics'
  }];
  registerForm: FormGroup = new FormGroup({});
  submitted: boolean = false;

  get registerFormControls() { return this.registerForm.controls; }

  get descriptionText() {
    return this.registerForm.get('description')?.value;
  }

  get descriptionTextLen() {
    return this.descriptionText?.length > 0 ? (300 - this.descriptionText?.length) : 300;
  }

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      businessName: ['', Validators.required],
      businessCategory: [''],
      businessTags: [''],
      website: ['', [Validators.pattern('')]],
      description: ['', [Validators.maxLength(300)]],
    });
  }

  onSelect(value: any) {
    const isExist = this.selectedBusinessTags.find((tag) => tag.toLowerCase() === value.toLowerCase());
    if (!isExist) {
      this.selectedBusinessTags.push(value);
    }
  }

  removeTag(tag: string) {
    this.selectedBusinessTags.splice(this.selectedBusinessTags.indexOf(tag), 1);
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
  }
}
