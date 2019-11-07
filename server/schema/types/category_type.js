const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;

const Category = mongoose.model("categories");

const CategoryType = new GraphQLObjectType({
  name: "CategoryType",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString }
  })
});

module.exports = CategoryType;