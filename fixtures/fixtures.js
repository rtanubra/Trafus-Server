const jwt = require('jsonwebtoken')

categories = [
    {name:'Food and wine', budget:200, team_id:1},
    {name:'Insurance', budget:300, team_id:1},
    {name:'Go Trains', budget:260, team_id:1}
]
categories_answer = [
    {name:'Food and wine', budget:200, team_id:1,id:1},
    {name:'Insurance', budget:300, team_id:1,id:2},
    {name:'Go Trains', budget:260, team_id:1,id:3}
]
expenses=[
    {name:'test_1_expense',expense:30, category_id:1},
    {name:'test_2_expense',expense:33, category_id:1},
    {name:'test_3_expense',expense:23, category_id:1},
    {name:'test_4_expense',expense:53, category_id:1},
    {name:'2_test_1_expense',expense:20, category_id:2},
    {name:'2_test_2_expense',expense:43, category_id:2},
    {name:'3_test_3_expense',expense:13, category_id:3},
    {name:'3_test_4_expense',expense:25, category_id:3}
]
expenses_answer = [
    {name:'test_1_expense',expense:30, category_id:1,id:1},
    {name:'test_2_expense',expense:33, category_id:1,id:2},
    {name:'test_3_expense',expense:23, category_id:1,id:3},
    {name:'test_4_expense',expense:53, category_id:1,id:4},
    {name:'2_test_1_expense',expense:20, category_id:2,id:5},
    {name:'2_test_2_expense',expense:43, category_id:2,id:6},
    {name:'3_test_3_expense',expense:13, category_id:3,id:7},
    {name:'3_test_4_expense',expense:25, category_id:3,id:8}
]
module.exports = {
    categories,
    categories_answer,
    expenses,
    expenses_answer
}