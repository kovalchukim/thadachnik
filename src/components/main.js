import React, { Component } from 'react';
import Task from './task';
import ReactModal from 'react-modal';
import '../App.css';
import { Service } from './Service';
import CreateTaskForm from './creatTaskForm';
import ReactPaginate from 'react-paginate';
import LoginForm from "./login-form";

const SORT_LIST = ['id', 'username', 'email', 'status', 'asc', 'desc'];
const IMG_FORMATS = [ 'JPG', 'GIF', 'PNG'];

class Main extends Component {
    state = {
        activeBtn: '',
        submitError: {},
        message: [],
        total: 0,
        current_page: 1,
        formValue: null,
        selectedImg: null,
        showPreviewForm: false,
        showForm: false,
        showLoginForm: false,
        isAuth: false,
        paginationItemsBefore: 2,
        paginationItemsAfter: 1,
    };

    componentDidMount() {
        this.getTasks();
    }

    setSubmitError(error) {
        this.setState({submitError: error})
    }

    setAuth(val) {
        this.setState({isAuth: val})
        this.hideForm()
    }

    scrollToTop() {
        window.scrollTo(0, 0);
    }

    handlePageChange(pageNum) {
        this.scrollToTop();
        let page = ++pageNum.selected;
        this.getTasks('&page=' + page);
    }

    editTask(formValue) {
        this.setState({
            showForm: true,
            formValue
        })
    }

    getTasks(params = '') {
        this.hideForm();
        Service.getTasks('Ivan' + params)
            .then(message => {
                this.setState({message: message.tasks, total: message.total_task_count})
            })
            .catch(err => {
                this.setSubmitError(err)
            });
    }

    backToCreate() {
        this.setState({showPreviewForm: !this.state.showPreviewForm})
    }

    sortByFiled(val) {
        this.setState({activeBtn: val });
        let sortFields = ['id', 'username', 'email', 'status'];
        let sort_direction = ['asc', 'desc'];
        let requestParam = '';

        if(sortFields.includes(val)) {
            requestParam = '&sortFields=' + val.toString();
        } else if(sort_direction.includes(val)) {
            requestParam = '&sort_direction=' + val.toString();
        }

        this.getTasks(requestParam);
    }

    handelFileSelected = event => {
        let imagFormat = event.target.files[0].name.split('.').pop()

        if(IMG_FORMATS.includes(imagFormat.toUpperCase())) {
            this.setState({selectedImg: event.target.files[0], submitError: {}})
        } else {
            this.setState({
                selectedImg: null,
                submitError: {
                    image: 'Упс...загрузите изображения в одном из форматов: JPG, GIF, PNG'
                }})
        }

    };

    createTask(val) {
        let image = this.state.selectedImg;
        Service.createTask(val.username, val.email, val.text, image)
            .then(repsons => {
                if(repsons.status === 'error') {
                    this.setSubmitError(repsons.message)
                }else if(repsons.status === 'ok'){
                    this.setState({
                        message: repsons.message,
                        selectedImg: null,
                        submitError: {}}
                        );
                    this.getTasks();
                }
            })
    }

    hideForm() {
        this.state.showForm ?
        this.setState({showForm: false, formValue: null, submitError: {}}) :
            this.state.showLoginForm &&
            this.setState({showLoginForm: false})
    }

    updateTask(formValue) {
        let signature={
            status: formValue.status,
            text: formValue.text,
            token: 'aaasdlfjashdkbsdfkashdfasdf'
        };

        let requestData = {
            signature: encodeURIComponent(JSON.stringify(signature)),
            status: formValue.status,
            text: formValue.text,
            token: 'aaasdlfjashdkbsdfkashdfasdf'
        };


        Service.updateTask(requestData, formValue.id)
            .then(repsons => {
                if(repsons.status === 'error') {
                    this.setSubmitError(repsons.message)
                }else if(repsons.status === 'ok'){
                    this.setState({
                        message: repsons.message,
                        selectedImg: null,
                        submitError: {}}
                    );
                    this.getTasks();
                }
            })

    }

  render() {
    return (
        <div>
            <h2>Задачник</h2>
            <button onClick={() => this.setState({showForm: true})} type='button' className='btn'>Create task</button>
            {!this.state.isAuth ?
                (<button onClick={() => this.setState({showLoginForm: true})} type='button' className='btn'>
                    Login
                </button>) :
                (<React.Fragment>
                    <button onClick={() => this.setState({isAuth: false})} type='button' className='btn'>
                        Logout
                    </button>
                    <span>Admin</span>
                </React.Fragment>)
            }

            <p>Сортировка:</p>

            {SORT_LIST.map((sortType, index) => {
                return (<button
                            key={index}
                            className={'btn ' + (this.state.activeBtn === sortType && 'active')}
                            onClick={() => this.sortByFiled(sortType)}
                            type='button' >
                                {sortType}
                        </button>)
            })}

           <ReactModal
               onRequestClose={this.hideForm.bind(this)}
               className="search-view-modal"
               isOpen={this.state.showForm || this.state.showLoginForm}
               ariaHideApp={false}
           >
               {this.state.showForm ?
               <CreateTaskForm
                   submitError={this.state.submitError}
                   selectedImg={this.state.selectedImg}
                   showHideForm={this.hideForm.bind(this)}
                   disabled={!this.state.selectedImg}
                   onSubmit={this.createTask.bind(this)}
                   handelFileSelected={this.handelFileSelected.bind(this)}
                   formValue={this.state.formValue}
                   updateTask={this.updateTask.bind(this)}
                   toggleShowPreviewTask={this.backToCreate.bind(this)}
                   showPreviewForm={this.state.showPreviewForm}
               /> : this.state.showLoginForm &&
                   <LoginForm setAuth={this.setAuth.bind(this)} /> }
           </ReactModal>

            <div>
                <ul>
                    {this.state.message.length && this.state.message.map((val, index) => {
                       return (
                           <Task
                               key={index} {...val}
                               editTask={this.editTask.bind(this, val)}
                               isAuth={this.state.isAuth}/>)
                    })}
                </ul>
            </div>
            <div className={`pagination-wrap ${!this.state.message.length ? 'hidden' : ''}`}>
                <ReactPaginate
                    previousLabel={''}
                    forcePage={this.state.current_page - 1}
                    nextLabel='->'
                    breakLabel={<span>...</span>}
                    pageCount={Math.ceil(this.state.total / 3)}
                    marginPagesDisplayed={this.state.paginationItemsAfter}
                    pageRangeDisplayed={this.state.paginationItemsBefore}
                    onPageChange={data => this.handlePageChange(data)}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                />
            </div>
        </div>
    );
  }
}

export default Main;
