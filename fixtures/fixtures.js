categories = [
    {name:'Food and wine', budget:200, team_id:1},
    {name:'Insurance', budget:300, team_id:1},
    {name:'Go Trains', budget:260, team_id:1}
]
categories_answer = [
    {name:'Go Trains', budget:260, team_id:1,id:3},
    {name:'Insurance', budget:300, team_id:1,id:2},
    {name:'Food and wine', budget:200, team_id:1,id:1}
]
users_builder = [
    {name:"Dunder Mifflin",user_name:"dunder",password:"$2b$11$S8zRR2/lY1NT9voQt4oo9ubhDmDbxW9/xEp0feNaABhMETe5XG2Iu",team_id:1},
    {name:"Bodeep Deboop",user_name:"deboop",password:"hello_deboop",team_id:1},
    {name:"Bodeep Deboop Bob",user_name:"bodeep",password:"hello_bodeep",team_id:2},
    {name:"Charlie Bloggs",user_name:"bloggs",password:"hello_bloggs",team_id:2}
]
teams_builder = [
    {name:"team_1"},
    {name:"team_2",password:"$2b$12$j9lMh9zTzefSAe2fDu3TSOnfOjfRgcT7SwlWyAifRwTCmIJyDqgZ6"}
]
teams=[
    {name:"team_1"},
    {name:"team_2",password:"goodPass1"}
]
teams_answer=[
    {name:"team_1",password:null,id:1},
    {name:"team_2",password:"$2b$12$j9lMh9zTzefSAe2fDu3TSOnfOjfRgcT7SwlWyAifRwTCmIJyDqgZ6",id:2}
]
expenses=[
    {name:'test_1_expense',expense:30, category_id:1,date_created: "2019-01-01T00:00:00.000Z",creator_id:1},
    {name:'test_2_expense',expense:33, category_id:1,date_created: "2019-01-01T00:00:00.000Z",creator_id:1},
    {name:'test_3_expense',expense:23, category_id:1,date_created: "2019-01-01T00:00:00.000Z",creator_id:1},
    {name:'test_4_expense',expense:53, category_id:1,date_created: "2019-01-01T00:00:00.000Z",creator_id:1},
    {name:'2_test_1_expense',expense:20, category_id:2,date_created: "2019-01-01T00:00:00.000Z",creator_id:1},
    {name:'2_test_2_expense',expense:43, category_id:2,date_created: "2019-01-01T00:00:00.000Z",creator_id:1},
    {name:'3_test_3_expense',expense:13, category_id:3,date_created: "2019-01-01T00:00:00.000Z",creator_id:1},
    {name:'3_test_4_expense',expense:25, category_id:3,date_created: "2019-01-01T00:00:00.000Z",creator_id:1}
]
expenses_answer = [
    {name:'3_test_4_expense',expense:25, category_id:3,id:8,date_created: "2019-01-01T00:00:00.000Z",creator_id:1},
    {name:'3_test_3_expense',expense:13, category_id:3,id:7,date_created: "2019-01-01T00:00:00.000Z",creator_id:1},
    {name:'2_test_2_expense',expense:43, category_id:2,id:6,date_created: "2019-01-01T00:00:00.000Z",creator_id:1},
    {name:'2_test_1_expense',expense:20, category_id:2,id:5,date_created: "2019-01-01T00:00:00.000Z",creator_id:1},
    {name:'test_4_expense',expense:53, category_id:1,id:4,date_created: "2019-01-01T00:00:00.000Z",creator_id:1},
    {name:'test_3_expense',expense:23, category_id:1,id:3,date_created: "2019-01-01T00:00:00.000Z",creator_id:1},
    {name:'test_2_expense',expense:33, category_id:1,id:2,date_created: "2019-01-01T00:00:00.000Z",creator_id:1},
    {name:'test_1_expense',expense:30, category_id:1,id:1,date_created: "2019-01-01T00:00:00.000Z",creator_id:1},
]
module.exports = {
    categories,
    categories_answer,
    expenses,
    expenses_answer,
    teams,
    teams_answer,
    teams_builder,
    users_builder
}