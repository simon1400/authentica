import React from 'react'
import {Route} from 'react-router-dom'

export default (
  <Route>
    <Route exact path="/" />
    <Route exact path="/kariera" />
    <Route exact path="/:article" />
    <Route exact path="/kariera/:position" />
  </Route>
)
