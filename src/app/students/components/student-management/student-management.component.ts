import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Student} from "../../../model/student";
import {StudentsService} from "../../services/students.service";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {SessionService} from "../../../core/service/session.service";
import {Session} from "../../../model/session";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.css']
})
export class StudentManagementComponent implements OnInit {

  constructor(private studentService: StudentsService,
              private router: Router,
              private sessionService: SessionService,
              private snackBar: MatSnackBar,
  ) {
  }

  students$!: Observable<Student[]>;
  students!: Student[];

  subscription!: Subscription;

  dataSource!: MatTableDataSource<Student>;

  ngOnInit(): void {
    this.students$ = this.studentService.getStudentList();
    this.subscription = this.students$.subscribe((studentList: Student[]) => {
      this.dataSource = new MatTableDataSource<Student>(studentList);
    })

    this.sessionService.getSession().subscribe((session: Session) => {
      console.log("get session from subscribe", session);
    })
  }

  displayedColumns: string[] = ['name', 'email', 'course', 'startDate', 'actions'];

  editStudent(element: Student) {
    this.router.navigate(['students/edit-form', element]);
  }

  deleteStudent(element: Student) {
    this.studentService.removeStudent(element).subscribe((student: Student) => {
      this.students$ = this.studentService.getStudentList();
      this.ngOnInit();
      this.openSnackBar(`${student.firstName} ${student.lastName} eliminado`);
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000
    });
  }
}
