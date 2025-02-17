import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UsersService} from "../../../services/users.service";
import {User} from "../../../models/user.models";
import {Quiz} from "../../../models/quiz.model";
import {ThemeService} from "../../../services/theme.service";
import {GameService} from "../../../services/game.service";
import {QuizService} from "../../../services/quiz.service";
import {Answer} from "../../../models/answer.models";
import {BehaviorSubject} from "rxjs";
import {UserConfigModel} from "../../../models/user-config.model";
import {Theme} from "../../../models/theme.models";
import {Question} from "../../../models/question.model";

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent {

  @Input() user: User = {
    firstName: "",
    lastName: "",
    id: "",
    stats: {
      statsByTheme: []
    },
    config: {} as UserConfigModel // Assign an empty UserConfigModel object
  };


  @Input() quiz: Quiz={
    id: "",
    name:"",
    theme:{name:""},
    questions:[],
  };
  noQuestions = false;

  isLoading: boolean = true; // Ajoutez une propriété isLoading pour indiquer si les données sont en cours de chargement



  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private themeService: ThemeService,
    private gameService:GameService,
    private quizService:QuizService,
    private router:Router
    ) {}

  ngOnInit() {
    const user = this.route.snapshot.queryParamMap.get('user')!;
    const quiz = this.route.snapshot.queryParamMap.get('quiz')!;

    this.usersService.getUserById(user).subscribe(
      response => {
        // Handle the user data received in the response
        console.log(response);
        // Assign the user data to this.user
        this.user = response;
        this.checkDataLoaded();
      },
      error => {
        // Handle any errors that occur during the HTTP request
        console.error(error);
        this.checkDataLoaded();
      }
    );
    this.quizService.getQuizById(quiz).subscribe(
      response => {
        // Handle the user data received in the response
        console.log(response);
        // Assign the user data to this.user
        this.quiz = response;
        console.log(this.quiz.questions.length)
        if(this.quiz.questions.length==0){
          this.noQuestions=true;
        }
        this.checkDataLoaded();
      },
      error => {
        // Handle any errors that occur during the HTTP request
        console.error(error);
        this.checkDataLoaded();
      }
    );
    console.log(this.quiz.questions.length)
  }
  checkDataLoaded() {
    // Verifier si toutes les données sont chargées (this.user et this.quiz) et mettez isLoading à false
    if (this.user && this.quiz) {
      this.isLoading = false;
      this.gameService.startGame(this.quiz);
      this.gameService.gameFinished.subscribe((result) => {
        console.log(`Game over! Score: ${result.score}, Quiz ID: ${result.quizId}`);
        this.route.queryParams.subscribe(() => {
          this.router.navigate(['/result'], { queryParams: { player: this.user.firstName, quiz: result.quizId } });
        });
      });
    }
  }


}
