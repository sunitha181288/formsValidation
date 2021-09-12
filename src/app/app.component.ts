import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
interface Animal {
  name: string;
  sound: string;
}
import emojiRegex from 'emoji-regex';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  animalControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  animals: Animal[] = [
    {name: 'Dog', sound: 'Woof!'},
    {name: 'Cat', sound: 'Meow!'},
    {name: 'Cow', sound: 'Moo!'},
    {name: 'Fox', sound: 'Wa-pa-pa-pa-pa-pa-pow!'},
  ];

  AUTO_COMPLETE_PAGE_LIMIT: number = 10;
  autocompletePageCount: number = 0;
  selectedBusinessTags: string[] = [];
  businessCategories = [{ "categoryCode": "BUS_CAT_LVL1_001", "categoryValue": "Arts and entertainment", "descriptionValue": "Arcades, karaokes, art exhibition" }, { "categoryCode": "BUS_CAT_LVL1_002", "categoryValue": "Automotive and boat", "descriptionValue": "Car parts, car servicing, boat servicing, gas station, car rentals" }, { "categoryCode": "BUS_CAT_LVL1_003", "categoryValue": "Beauty, cosmetics and personal care", "descriptionValue": "Cosmetics, skin care products, nail service, salon services, facial" }, { "categoryCode": "BUS_CAT_LVL1_004", "categoryValue": "Charity & Non-profit Organization", "descriptionValue": "Churches, charities" }, { "categoryCode": "BUS_CAT_LVL1_005", "categoryValue": "Concerts, festivals and theme parks", "descriptionValue": "Concerts, music festivals, carnivals, CNY fairs, amusement parks" }, { "categoryCode": "BUS_CAT_LVL1_006", "categoryValue": "Electronic products", "descriptionValue": "Phones, TV, home appliances" }, { "categoryCode": "BUS_CAT_LVL1_007", "categoryValue": "Fashion, clothing and accessories", "descriptionValue": "Boutiques, fast fashion chains" }, { "categoryCode": "BUS_CAT_LVL1_008", "categoryValue": "Food and beverages", "descriptionValue": "Restaurants, cafes, food stalls, bar" }, { "categoryCode": "BUS_CAT_LVL1_009", "categoryValue": "Home", "descriptionValue": "Home materials, renovation, lighting" }, { "categoryCode": "BUS_CAT_LVL1_010", "categoryValue": "Hotel, travel and transportation", "descriptionValue": "MTR train tickets, bus fare, travel agencies, parking fees, hotel booking, entrance fees" }, { "categoryCode": "BUS_CAT_LVL1_011", "categoryValue": "Jewelries and watches", "descriptionValue": "Jewelries retail shops" }, { "categoryCode": "BUS_CAT_LVL1_012", "categoryValue": "Kids and babies", "descriptionValue": "Diapers, milk bottles, toys" }, { "categoryCode": "BUS_CAT_LVL1_013", "categoryValue": "Learning and education", "descriptionValue": "Tuition fees, online courses, private tutors, classes" }, { "categoryCode": "BUS_CAT_LVL1_014", "categoryValue": "Leasing, property management and real estate", "descriptionValue": "Shopping malls kiosks, car park rental, management fees" }, { "categoryCode": "BUS_CAT_LVL1_015", "categoryValue": "Local services", "descriptionValue": "Helpers, plumbers, cleaning, technician services, car wash, piano tuning, delivery services, photo shoots" }, { "categoryCode": "BUS_CAT_LVL1_016", "categoryValue": "Medical and healthcare", "descriptionValue": "Clinics, pharmacies, Chinese doctors, hospitals" }, { "categoryCode": "BUS_CAT_LVL1_017", "categoryValue": "Outdoor and recreation", "descriptionValue": "Rental of facilities, agriculture, camping, boat trips, party rooms, club memberships" }, { "categoryCode": "BUS_CAT_LVL1_018", "categoryValue": "Pets", "descriptionValue": "Pet shops, pet supplies" }, { "categoryCode": "BUS_CAT_LVL1_019", "categoryValue": "Printing, packaging, stationaries and office equipments", "descriptionValue": "Book shops, magazines, printing shops, stationary shops" }, { "categoryCode": "BUS_CAT_LVL1_020", "categoryValue": "Professional services and organizations", "descriptionValue": "Professional qualification membership fees, legal services, tax accountancy, business consulting fees, agency fees, marketing fees" }, { "categoryCode": "BUS_CAT_LVL1_021", "categoryValue": "Public, government and utility services", "descriptionValue": "Water bills, electric bills, gas bills, telecom bills" }, { "categoryCode": "BUS_CAT_LVL1_022", "categoryValue": "Retail shops and department stores", "descriptionValue": "Department stores, gift shops, toy shops,  miscellaneous products" }, { "categoryCode": "BUS_CAT_LVL1_023", "categoryValue": "Sports, fitness and wellness", "descriptionValue": "Spa, gym, massage, yoga, wellness products, sports classes" }, { "categoryCode": "BUS_CAT_LVL1_024", "categoryValue": "Supermarkets, pharmacies, groceries and wet markets", "descriptionValue": "Butcher shops, supermarkets, daily food" }]
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
      businessCategoryCheckbox: [''],
      businessTag: [''],
      businessTags: [[]],
      website: ['', [Validators.pattern('')]],
      description: ['', [Validators.maxLength(300)]],
    });
    const firstItem = this.businessCategories[0].categoryCode;
    //to set the mat-select default value.
    this.registerForm.get('businessCategory')?.setValue(firstItem);
    //to set the mat-checkbox default value.
    this.registerForm.get('businessCategoryCheckbox')?.setValue(firstItem);

    Object.keys(this.registerForm.value).forEach((field) => {
      this.registerForm.controls[field].valueChanges
        .subscribe((value) => {
          if (value != "") {
            if (!this.completedItems.includes(field)) {
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
      .subscribe((value) => {
        if(emojiRegex().exec(value)) {
          this.registerForm.get('businessTag')?.setErrors({ patternError: true })
        }else {
          if (value != null && value !== "") {
            this.fetchBusinessTags(value);
            // call API to fetch autocomplete tags
          } else {
            // empty string
            this.filtertedBusinessTags = this.businessTags;
          }
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
      this.fetchBusinessTags(index);
    }
  }

  fetchBusinessTags(index: number) {
    const pageLimit = this.AUTO_COMPLETE_PAGE_LIMIT;
    const pageCount = this.autocompletePageCount;
    this.httpClient.get('assets/stub.json').pipe(map((data: any) => {
      const result = data.slice(pageCount, (pageCount + pageLimit));
      this.autocompletePageCount += pageLimit;
      // after results fetched, increment the page count
      return result;
    })).subscribe((response) => {
      if(this.registerForm.get('businessTag')?.value === "" && index === 0){
        // this.businessTags = [];
        // this.filtertedBusinessTags = [];
      } else {
        this.businessTags = this.businessTags.concat(response);
        this.filtertedBusinessTags = this.businessTags;
      }
    });
  }
}