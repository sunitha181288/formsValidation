import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tutor-app';
  businessTags: string[] = ['Canteen', 'Cafe', 'Charity'];
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
  }]

  onSelect(value: any){
    this.selectedBusinessTags.push(value);
  }

  removeTag(tag: string){
    this.selectedBusinessTags.splice(this.selectedBusinessTags.indexOf(tag), 1);
  }
}
