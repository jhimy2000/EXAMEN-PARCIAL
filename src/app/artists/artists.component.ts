import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Artists } from '../models/artists';
import { HttpDataService } from '../services/artists.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css'],
})
export class ArtistsComponent implements OnInit {
  @ViewChild('artistsForm', { static: false })
  artistsForm!: NgForm;

  artistsData!: Artists;

  dataSource = new MatTableDataSource();

  displayedColumns: string[] = [
    'id',
    'name',
    'photo',
    'favorite_sports',
    'points',
  ];

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  isEditMode = false;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private httpDataService: HttpDataService) {
    this.artistsData = {} as Artists;
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;

    this.getAllStudents();
  }

  getAllStudents() {
    this.httpDataService.getList().subscribe((response: any) => {
      this.dataSource.data = response;
    });
  }

  // FEOKEOF
  editItem(element: any) {
    this.artistsData;
    this.artistsData = _.cloneDeep(element);

    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;

    this.artistsForm.resetForm();
  }

  deleteItem(id: string) {
    this.httpDataService.deleteItem(id).subscribe((reponse: any) => {
      this.dataSource.data = this.dataSource.data.filter((o: any) => {
        return o.id !== id ? o : false;
      });
    });

    console.log(this.dataSource.data);
  }

  //ojo
  addStudent() {
    this.artistsData.id = 0;

    this.httpDataService
      .createItem(this.artistsData)
      .subscribe((response: any) => {
        this.dataSource.data.push({ ...response });

        this.dataSource.data = this.dataSource.data.map((o: any) => {
          return o;
        });
      });
  }

  updateStudent() {
    this.httpDataService
      .updateItem(this.artistsData.id, this.artistsData)
      .subscribe((response: any) => {
        this.dataSource.data = this.dataSource.data.map((o: any) => {
          if (o.id == response.id) {
            o = response;
          }

          return o;
        });
      });
  }

  onSubmit() {
    if (this.artistsData.form.valid) {
      console.log('valid');

      if (this.isEditMode) {
        console.log('about to update');

        this.updateStudent();
      } else {
        console.log('about to create');

        this.addStudent();
      }

      this.cancelEdit();
    } else {
      console.log('Invalid data');
    }
  }
}
