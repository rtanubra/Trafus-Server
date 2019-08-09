const ValidateHelper = require(`../src/validator/validator`)

describe(`Unit testing ValidateHelper`,()=>{
    describe(`nameCheck`,()=>{
        context(`name lengths`,()=>{
            it(`name.length >=3 `,()=>{
                expect(ValidateHelper.nameCheck("he")).to.eql([false,"Should be between 3-20 characters"])
            })
            it(`name.length <= 20`,()=>{
                expect(ValidateHelper.nameCheck("12345678901234567890a")).to.eql([false,"Should be between 3-20 characters"])
            })
            it(`no error when 3 <= name.length >=20`,()=>{
                expect(ValidateHelper.nameCheck("abcd123_.1")).to.eql([true,0])
            })
        })
        context(`must contain a-zA-Z`,()=>{
            it(`must contain alphabetical characters `,()=>{
                expect(ValidateHelper.nameCheck("123")).to.eql([false,"Should contain alphabetical characters"])
            })
        })
        context(`Should only contain alphanumeric, underscores '_', periods'.' spaces ' ' .`,()=>{
            it(`Not allow anything other than alphanumeric,underscores,periods`,()=>{
                expect(ValidateHelper.nameCheck('1#a4apple')).to.eql([false,`Should only contain alphanumeric, underscores '_', periods'.' spaces ' ' .`])
            })
        })
    })
})