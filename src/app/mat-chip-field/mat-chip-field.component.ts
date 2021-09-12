import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-chip-field',
  templateUrl: './mat-chip-field.component.html',
  styleUrls: ['./mat-chip-field.component.scss']
})
export class ChipFieldComponent implements OnInit {
  @Output()
  public selectTag = new EventEmitter();
  @Output()
  public removeTag = new EventEmitter();
  @Output()
  public scrollChange = new EventEmitter();
  @Input()
  selectedBusinessTags: string[] = [];
  @Input()
  public formGroup!: FormGroup;
  @Input() businessTags!: string[];
  showSuggestedInput: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onSelect(event: any) {
    this.selectTag.emit(event);
  }

  onSelectSuggest() {
    this.showSuggestedInput = true;
  }

  applyKeyword(event: any) {
    this.onSelect({
      input: event.target,
      value: event.target.value
    });
  }

  onRemoveTag(tag: string) {
    this.removeTag.emit(tag);
  }

  nextBatch(event: any) {
    this.scrollChange.emit(event);
  }

  trackByIdx(i: number) {
    return i;
  }
}
