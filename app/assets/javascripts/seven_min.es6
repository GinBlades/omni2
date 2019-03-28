$(() => {
    const ExerciseInList = ({exercise, onRemoveExercise}) => (
        <li className="exercise">
            <p>
                {exercise.position} - {exercise.exercise}
                <button onClick={() => onRemoveExercise(exercise)}
                    className="btn btn-default btn-xs">X</button>
            </p>
        </li>
    );

    class NewExerciseForm extends React.Component {
        constructor(props) {
            super(props);
            this.newExercise = {
                exercise: "",
                description: "",
                position: ""
            }

            this.submitNewExercise = this.submitNewExercise.bind(this);
        }

        submitNewExercise(evt) {
            evt.preventDefault();
            this.newExercise = {
                exercise: this.exercise.value,
                description: this.description.value,
                position: this.position.value
            };
            [this.exercise, this.description, this.position].forEach((input) => {
                input.value = "";
            });
            this.props.onNewExercise(this.newExercise);
        }

        render() {
            return (
                <form onSubmit={this.submitNewExercise}>
                    <fieldset>
                        <legend>Add New Exercise</legend>
                        <div className="form-group">
                            <label htmlFor="new-exercise-exercise">Exercise</label>
                            <input name="exercise" id="new-exercise-exercise" type="text"
                                ref={(input) => {this.exercise = input;}} className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="new-exercise-description">Description</label>
                            <input name="description" id="new-exercise-description" type="text"
                                ref={(input) => {this.description = input;}} className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="new-exercise-position">Position</label>
                            <input name="position" id="new-exercise-position" type="number"
                                ref={(input) => {this.position = input;}} className="form-control"/>
                        </div>
                        <input type="submit" value="Add"/>
                    </fieldset>
                </form>
            );
        }
    }

    class ExerciseRunner extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                exercise: props.exercise,
                timeLeft: props.timeLeft
            };
        }

        // Lifecycle method to use when setting state from props,
        // as described here: https://hackernoon.com/common-pitfall-in-initialising-state-based-on-props-in-react-js-d56795a944aa
        componentWillReceiveProps(nextProps) {
            let audio = document.getElementById("tick-sound")
            audio.volume = 0.5;
            audio.play();
            this.setState({
                exercise: nextProps.exercise,
                timeLeft: nextProps.timeLeft
            });
        }

        render() {
            return (
                <div className="row">
                    <div className="col-md-12">
                        <div className="panel panel-primary">
                            <div className="panel-heading">{this.state.exercise.exercise}</div>
                            <div className="panel-body">{this.state.timeLeft}</div>
                            <audio id="tick-sound">
                                <source src="/beep.mp3" type="audio/mpeg"/>
                            </audio>
                        </div>
                    </div>
                </div>
            );
        }
    }

    class SevenMinApp extends React.Component {

        constructor(props) {
            super(props);

            this.runner = null;
            this.exerciseTime = 5;
            this.restTime = 2;

            this.state = {
                // Rendered in view as JSON
                exerciseList: this.sortedExercises(exerciseList),
                currentIndex: 0,
                timeLeft: this.exerciseTime
            };

            this.handleNewExercise = this.handleNewExercise.bind(this);
            this.handleRemoveExercise = this.handleRemoveExercise.bind(this);
            this.run = this.run.bind(this);
        }

        sortedExercises(list) {
            return list.sort((a, b) => (a.position - b.position));
        }

        prepareExercises() {
            const list = this.sortedExercises(this.state.exerciseList);
            let finalList = [];
            list.forEach((exercise, idx) => {
                if (exercise.exercise == "Rest") {
                    return;
                }
                finalList.push(exercise);
                finalList.push({
                    id: idx + 100,
                    exercise: "Rest",
                    description: "",
                    position: finalList.length
                });
            });
            return finalList;
        }

        handleRemoveExercise(exercise) {
            let _this = this;
            $.ajax({
                url: "/admin/workouts/seven_mins/" + exercise.id,
                type: "DELETE",
                success: na => {
                    let exerciseList = _this.state.exerciseList;
                    let ids = exerciseList.map(ex => ex.id);
                    let index = ids.indexOf(exercise.id);
                    exerciseList.splice(index, 1);
                    _this.setState(prevState => ({
                        exerciseList: _this.sortedExercises(exerciseList),
                        currentIndex: prevState.currentIndex,
                        timeLeft: prevState.timeLeft
                    }));
                }
            });
        }

        handleNewExercise(exercise) {
            let _this = this;
            $.post("/admin/workouts/seven_mins", {
                seven_min: {
                    exercise: exercise.exercise,
                    description: exercise.description,
                    position: exercise.position
                }
            }).then(result => {
                _this.setState(prevState => ({
                    exerciseList: _this.sortedExercises([...prevState.exerciseList, result]),
                    currentIndex: prevState.currentIndex,
                    timeLeft: prevState.timeLeft
                }));
            });
        }

        run() {
            let _this = this;
            if (this.runner !== null) {
                clearInterval(this.runner);
            }

            this.setState(prevState => ({
                exerciseList: this.prepareExercises(prevState.exerciseList),
                currentIndex: 0,
                timeLeft: _this.exerciseTime
            }));

            this.runner = setInterval(() => {
                if (_this.state.timeLeft <= 0) {
                    _this.setState(prevState => {
                        let timeLeft = _this.exerciseTime;

                        if (prevState.exerciseList[prevState.currentIndex].exercise != "Rest") {
                            timeLeft = _this.restTime;
                        }
                        return {
                            exerciseList: prevState.exerciseList,
                            currentIndex: ++prevState.currentIndex,
                            timeLeft: timeLeft
                        }
                    });
                } else {
                    _this.setState(prevState => ({
                        exerciseList: prevState.exerciseList,
                        currentIndex: prevState.currentIndex,
                        timeLeft: --prevState.timeLeft
                    }));
                }

                if (_this.state.currentIndex + 1 >= _this.state.exerciseList.length) {
                    clearInterval(this.runner);
                }
            }, 1000);
        }

        render() {
            return (<div>
                <div className="row">
                    <div className="col-md-8">
                        <h1>Start a 7-minute Workout</h1>
                        <p>
                            <button onClick={this.run} className="btn btn-primary">Start</button>
                        </p>
                        <ExerciseRunner timeLeft={this.state.timeLeft} exercise={this.state.exerciseList[this.state.currentIndex]} />
                    </div>
                    <div className="col-md-4">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">Exercise List</h3>
                            </div>
                            <div className="panel-body">
                                <ul>
                                    {this.state.exerciseList.map((exercise) => (
                                        exercise.exercise == "Rest" ? "" : <ExerciseInList key={exercise.id} exercise={exercise}
                                        onRemoveExercise={this.handleRemoveExercise} />
                                    ))}
                                </ul>
                                <NewExerciseForm onNewExercise={this.handleNewExercise} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
        }
    }

    if ($("#seven-min-app").length) {
        ReactDOM.render(
            <SevenMinApp />,
            document.getElementById("seven-min-app"));
    }
});
