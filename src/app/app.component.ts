import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  AUTO_COMPLETE_PAGE_LIMIT: number = 10;
  autocompletePageCount: number = 0;
  selectedBusinessTags: string[] = [];
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
  businessTags: string[] = [];
  filtertedBusinessTags: string[] = [];
  currentIndex: number = -1;
  completedPercentage: number = 0;
  completedItems: string[] = [];

  get registerFormControls() { return this.registerForm.controls; }

  get descriptionText() {
    return this.registerForm.get('description')?.value;
  }

  get selectedCategory() {
    return this.registerForm.get('businessCategory')?.value;
  }

  get descriptionTextLen() {
    return this.descriptionText?.length > 0 ? (300 - this.descriptionText?.length) : 300;
  }

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      businessName: ['', Validators.required],
      businessCategory: [''],
      businessTag: [''],
      businessTags: [[]],
      website: ['', [Validators.pattern('')]],
      description: ['', [Validators.maxLength(300)]],
    });
    Object.keys(this.registerForm.value).forEach((field) => {
      this.registerForm.controls[field].valueChanges
      .subscribe((value) => {
        if(value != "") {
          if(!this.completedItems.includes(field)){
            this.completedPercentage += 20;
            this.completedItems.push(field);
          }
        } else {
          this.completedPercentage += -20;
          this.completedItems.splice(this.completedItems.indexOf(field), 1);
        }
      });
    });
    this.registerForm.controls['businessTag'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''))
      .subscribe(value => {
        if (value != null && value !== "") {
          this._filter(value);
          // call API to fetch autocomplete tags
        } else {
          // empty string
          this.filtertedBusinessTags = this.businessTags;
        }
      });
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    this.filtertedBusinessTags = this.businessTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }

  onSelect(tag: any) {
    const input = tag.input;
    const value = tag.value;
    const isLimitExceed = this.selectedBusinessTags?.length > 4; // to check tags length
    if ((value || "").trim() && !this.selectedBusinessTags.includes(value)) {
      const trimvalue = value.trim();
      this.selectedBusinessTags.push(trimvalue);
    }
    if (input) {
      input.value = "";
    }
    this.registerForm.get('businessTag')?.setValue(null);
    if (isLimitExceed) {
      this.registerForm.get('businessTags')?.setErrors({ maxlength: true })
    }
  }

  onRemoveTag(tag: string) {
    const index = this.selectedBusinessTags.indexOf(tag);
    if (index >= 0) {
      this.selectedBusinessTags.splice(index, 1);
      if (this.registerForm.get('businessTags')?.errors?.maxlength) {
        this.registerForm.get('businessTags')?.setErrors(null);
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
  }

  onScrollChange(index: number) {
    if (index > this.currentIndex) {
      this.currentIndex = index;
      this.fetchBusinessTags();
    }
  }

  fetchBusinessTags() {
    const pageLimit = this.AUTO_COMPLETE_PAGE_LIMIT;
    const pageCount = this.autocompletePageCount;
    this.httpClient.get('assets/stub.json').pipe(map((data: any) => {
      const result = data.slice(pageCount, (pageCount + pageLimit));
      this.autocompletePageCount += pageLimit;
      // after results fetched, increment the page count
      return result;
    })).subscribe((response) => {
      this.businessTags = this.businessTags.concat(response);
      this.filtertedBusinessTags = this.businessTags;
    });
  }
}