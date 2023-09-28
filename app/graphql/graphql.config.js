const { graphql_schema } = require("./index.graphql");

function graphqlConfig(req, res) {
  return {
    schema: graphql_schema,
    graphiql: true,
    context: { req, res },
  };
}

module.exports = { graphqlConfig };
