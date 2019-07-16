import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Table, Button, Card } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs:[],
             loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        //this.loadData(() =>
            //this.setState({ loaderData })
        //)
        
        //console.log(this.state.loaderData)
    }


    componentDidMount() {
        this.init();
        this.loadData();
    };

    loadData(callback) {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs?showActive=true&showExpired=true';
        var cookies = Cookies.get('talentAuthToken');
        // your ajax call and other logic goes here        
        $.ajax({
            url: 'http://localhost:51689/listing/listing/getSortedEmployerJobs?showActive=true&showExpired=true&showClosed=false&showDraft=true&showUnexpired=true',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                let loadJobs = null;
                let TotalCount = null;
                if (res.success==true) {
                    loadJobs = res.myJobs,
                        TotalCount = res.count
                    console.log("List of jobs", loadJobs)
                    console.log("No job found", TotalCount)
                }
                this.JobsRecords(loadJobs);
                this.RecordsCount(TotalCount);
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        })
        this.init()
    }

    JobsRecords(List) {
        this.setState({
            loadJobs: List

        })
    }

    RecordsCount(count) {
        this.setState({
            TotalCount: count
        })
    }
    closejob(id) {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:51689/listing/listing/closeJob',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data:JSON.stringify(id),
            success: function (res) {
                if (res.success==true) {
                    const updatedloadJob = this.state.loadJobs.filter(
                        record => record.id != id
                    );

                    // Update the state.
                    this.setState({ loadJobs: updatedloadJob });
                    TalentUtil.notification.show(res.message, "success", null, null);
                    window.location = "/ManageJobs";
                } else {
                    TalentUtil.notification.show(res.message, "error", null, null)
                }

            }.bind(this)
                    
        })
    }
    
    

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    };
    renderButton(date) {
        //var today = (new Date()).setHours(0, 0, 0, 0)
        //var expDate = date.setHours(0,0,0,0)
        if (date.getTime != new Date().getTime) {
             
            return (<Button size='mini' className='red'>
                Expired
                                            </Button>);
        }
            else {
                return (<Button size='mini'>
                    Not expired
                                            </Button>);
            }
        
        }
    render() {
        const loadJobs = this.state.loadJobs;
        if (loadJobs == 0) {
            return (
                <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                    <div className="ui container">
                        <div className="margin-left">
                            <h1>List of Jobs</h1>
                            <div className="ui dropdown">
                                <i className="filter icon"></i>
                                <div className="text">Filter:</div>
                                <span className="bold"> choose filter<i className="dropdown icon"></i></span>
                            </div>
                            <div className="ui dropdown">
                                <i className="calendar alternate icon"></i>
                                <div className="text">Sort by date:</div>
                                <span className="bold"> newest first<i className="dropdown icon"></i></span>
                            </div>
                            
                               <p class="no-job"> No Job Found</p>
                            

                        </div>
                    </div>
                </BodyWrapper>
                )
        }

        else {

            return (
                <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                    <div className="ui container">
                        <div className="margin-left">
                            <h1>List of Jobs</h1>
                            <div className="ui dropdown">
                                <i className="filter icon"></i>
                                <div className="text">Filter:</div>
                                <span className="bold"> choose filter<i className="dropdown icon"></i></span>
                            </div>
                            <div className="ui dropdown">
                                <i className="calendar alternate icon"></i>
                                <div className="text">Sort by date:</div>
                                <span className="bold"> newest first<i className="dropdown icon"></i></span>
                            </div>
                            <div className="ui cards">
                                {this.state.loadJobs.map(record => (

                                    <Card style={{ width: '350px', }} key={record.id}>
                                        <Card.Content>
                                            <Card.Header>{record.title}</Card.Header>
                                            <div>
                                                <a className="ui black right ribbon label"> <i aria-hidden="true" className="user icon"></i>
                                                    {record.noOfSuggestions} </a>
                                            </div>
                                            <div>
                                                <Card.Meta>{record.location.country}, {record.location.city}</Card.Meta>
                                                <Card.Description>{record.summary}</Card.Description>
                                            </div>
                                        </Card.Content>

                                        <Card.Content extra>

                                            <div style={{ float: 'left', }}>
                                                {this.renderButton(record.expiryDate)}
                                            </div>


                                            <div className="ui buttons mini right floated">
                                                <Button basic color='blue' onClick={() => this.closejob(record.id)}>
                                                    <i aria-hidden="true" className="ban icon"></i>
                                                    close
                                                </Button>
                                                <Button basic color='blue' href={"/EditJob/" + record.id} ><i aria-hidden="true" className="edit icon"></i>
                                                    edit
                                             </Button>
                                                <Button basic color='blue'><i aria-hidden="true" className="copy icon"></i>
                                                    copy
                                         </Button>
                                            </div>

                                        </Card.Content>
                                    </Card>

                                ))}

                            </div>
                            <div style={{ margin: '20px 0 20px 0', textAlign: 'center', }}>
                                <Pagination
                                    boundaryRange={0}
                                    defaultActivePage={1}
                                    ellipsisItem={null}
                                    firstItem={null}
                                    lastItem={null}
                                    siblingRange={1}
                                    totalPages={10}
                                />
                            </div>

                        </div>
                    </div>
                </BodyWrapper>
            )
        }
    }
}