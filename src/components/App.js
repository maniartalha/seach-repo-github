import React from 'react';
import { Link } from 'react-router';
import { version } from '../../package.json';
import {search} from '../utility/utils';
 
const optionsField = ["stars", "watchers", "count", "score", "name","created_at", "updated_at"];

class App extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        searchText:'',
        items:null,
        selected:'',
        page:1,
        perPage:25,
        loader:false
      }
      this.textChangeHandler = this.textChangeHandler.bind(this);
      this.keyDownHandler = this.keyDownHandler.bind(this);
      this.showData = this.showData.bind(this);
      this.selectChangeHandler = this.selectChangeHandler.bind(this);
      this.showOptions = this.showOptions.bind(this);
      this.scrollFireHandler = this.scrollFireHandler.bind(this);
      this.clearField = this.clearField.bind(this);
    }

    textChangeHandler(e) {
      this.setState({
        searchText:e.currentTarget.value
      })
    }

    keyDownHandler(e) {
      var self = this;
      if ((window.event ? e.keyCode : e.which) == 13) {
        if(this.state.searchText === '') {
          this.clearField()
        } else {
          search(this.state.searchText, this.state.selected !== '' ?this.state.selected:'', this.state.page, this.state.perPage, (err, obj)=> {
            if(obj) {
              this.setState({
                items:obj
              })
              // console.log("keyDownHandler", self.state.items)
            }
          });
        }
      }
    }

    selectChangeHandler(e) {
      this.setState({
        selected:e.currentTarget.value
      })

      if(this.state.searchText && e.currentTarget.value) {
        search(this.state.searchText, e.currentTarget.value, this.state.page, this.state.perPage, (err, obj)=> {
          if(obj) {
            this.setState({
              items:obj
            })
            // console.log("keyDownHandler", self.state.items)
          }
        });
      }
    }

    showOptions() {
      return optionsField.map((obj, i) => {
        return (
          <option value={obj} key={`${obj}${i}`}>{obj}</option>
        )
      })
    }
 
    showData() {
      if(!this.state.items.items.length) {
        this.clearField()
      }
       return this.state.items.items.map((obj, i) => {
          return (
            <div className="card-detail" key={obj.id+"_"+i}>
              <span className="name">{obj.name}</span>
              <span>{obj.language}</span>
              <img src={obj.owner.avatar_url} className="avatar-img"/>

            </div>
          )
        })  
      
    }

    clearField() {
      this.setState({
        searchText:'',
        items:null,
        selected:'',
        page:1,
        perPage:25
      })
    }

    scrollFireHandler(e) {
      let elem = e.currentTarget;
      let self = this;
      if(this.state.items.items.length){
        if(elem.scrollTop + elem.clientHeight >= elem.scrollHeight) {
          
          if(self.state.items.items.length ){
                this.setState({
                  loader:true
                })
                let page = self.state.page;
                let perPage = self.state.perPage;
                let total = this.state.items.total_count - self.state.perPage


                if(this.state.items.total_count < self.state.perPage){                  
                  console.log("length", page, self.state.perPage)
                  page = self.state.page;                  
                  return
                }else{
                   if(self.state.perPage === 100) {
                      page += (page)
                      perPage = total <= 25 ? total : 25 
                      // console.log("if PERPAGE", page, perPage)
                  } else if (total <= this.state.items.total_count) {
                      perPage += 25;
                      // console.log("esle", page, perPage)
                    }              
                }
               

                if(this.state.searchText) { 
                  if(this.state.items.items.length < self.state.perPage) {
                    this.setState({
                      loader:false
                    })
                  return;
                  } else {                
                    search(this.state.searchText, this.state.selected, page, perPage, (err, obj)=> {
                      if(err.message) {
                        this.setState({
                          loader:false
                        })
                      } 
                      if(obj) {
                        this.setState({
                          items:obj,
                          loader:false
                        })
                      }
                    });  
                  }                
                }

                self.setState({
                    page : page,
                    perPage:perPage,
                    loader:false
                })
            }
        }
      }
    }

    render() {
        var data_exists = !! this.state.items
        return (
            <div className="search-container" onScroll={this.scrollFireHandler}>
              <section>
                <div className = "search-field">
                  <div className="search-form clearfix">
                    <input type="text" placeholder="Search Repo..." value={this.state.searchText} onChange={this.textChangeHandler} onKeyDown= {this.keyDownHandler}/>
                    {this.state.searchText ? <span className="clear-field" onClick={this.clearField}>x</span>:null}
                    <div className={this.state.searchText ? "sort-field":"sort-field disabled"} title ={this.state.searchText?'':"Enter the search repo name and then sort"} >
                      <select onChange={this.selectChangeHandler} value={this.state.selected}>
                        {this.showOptions()}
                      </select>
                    </div>
                  </div>
                  <div className="search-wrapper">
                    {data_exists ? 
                      this.showData()
                      : <p className="no-data">No data Found Please enter the valid data in Search Box field</p>
                    }
                  </div>
                </div>
                {this.state.loader && this.state.items.items.length?
                  <div className="loading">
                    Loading....
                  </div>
                : null}
              </section>
            </div>
        );
    }
}

App.propTypes = { children: React.PropTypes.object };

export default App;