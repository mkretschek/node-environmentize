// TODO(mkretschek): translate docs and comments
/**
 * @fileoverview Define helpers para lidar com diferenças de configuração
 *    entre os ambientes de desenvolvimento.
 *
 * @author Mathias Kretschek <mathias@kretschek.com.br>
 * @version 0.0.3
 */
var _ = require('underscore');


/**
 * Handled environments' names.
 * @enum {string}
 * @const
 */
var Environment = {
  PRODUCTION  : 'production',
  DEVELOPMENT : 'development',
  TEST        : 'test',
  STAGE       : 'stage'
};


/**
 * Default environment.
 * @type {Environment}
 * @const
 */
var DEFAULT_ENV = Environment.DEVELOPMENT;


/**
 * Environment in which this process is running.
 * @type {Environment}
 * @const
 */
var ENV = process.env.NODE_ENV || DEFAULT_ENV;


/**
 * Método que retorna um valor de acordo com o ambiente no qual
 * é executado.
 *
 * Se executado apenas com um parâmetro, este parâmetro deve ser um objeto
 * mapeando valores para cada ambiente. Ex.:
 *    
 *    var e12e = require('environmentize');
 *    e12e({
 *      development : 'foo',
 *      production : 'bar',
 *      other : 'baz'
 *    });
 * 
 * O código acima retornará 'foo' se o `NODE_ENV` for 'development', 'bar' se
 * for 'production' e 'baz' se tiver qualquer outro valor.
 *
 * Caso seja executado com 2 valores, o primeiro valor será utilizado para
 * ambientes de produção e staging enquanto o segundo será utilizado para
 * desenvolvimento e teste. Ex.:
 *
 *    var e12e = require('environmentize');
 *    e12e('foo', 'bar');
 *
 * Neste caso, nos ambientes 'production' e 'staging' o valor retornado será
 * 'foo', enquanto 'bar' será retornado para os ambientes 'development' e
 * 'test'.
 *
 * @param {*} var_params Podem ser 2 parâmetros, onde o primeiro representa o
 *    valor para production/staging e o segundo para development/test ou um
 *    objeto mapeando valores para cada ambiente. No segundo caso, a key
 *    `other` pode ser utilizada para definir um valor padrão, utilizado
 *    quando o ambiente não tiver um valor definido especificamente para ele.
 *
 * @returns {*} Valor atribuído para o ambiente no qual o código está sendo
 *    executado.
 */
var e12e = module.exports = function () {
  var args = arguments;
  if (args.length === 1 && _.isObject(args[0]))
    return environmentize_(args[0]);
  else if (args.length === 2) {
    var val = {};
    val[Environment.PRODUCTION] = val[Environment.STAGE] = args[0];
    val[Environment.DEVELOPMENT] = val[Environment.TEST] = args[1];
    return environmentize_(val);
  } else throw(new Error('Invalid environmentize params.'));
};


/**
 * Returns the environment in which this process.
 */
Object.defineProperty(e12e, 'env', {
  get : function () { return process.env.NODE_ENV || DEFAULT_ENV; },
  configurable : false,
  enumerable : true
});


/**
 * Checks if production is the current environment.
 * @returns {boolean} True if environment is Environment.PRODUCTION.
 */
e12e.isProduction = function () { return this.env === Environment.PRODUCTION; };


/**
 * Checks if development is the current environment.
 * @returns {boolean} True if environment is Environment.DEVELOPMENT.
 */
e12e.isDevelopment = function () { return this.env === Environment.DEVELOPMENT; };


/**
 * Checks if test is the current environment.
 * @returns {boolean} True if environment is Environment.TEST.
 */
e12e.isTest = function () { return this.env === Environment.TEST; };


/**
 * Checks if stage is the current environment.
 * @returns {boolean} True if environment is Environment.STAGE.
 */
e12e.isStage = function () { return this.env === Environment.STAGE; };


/**
 * Configures an express.js app, adding a simplified e12e object to the
 * locals object. We don't make the original object available to make it more
 * difficult to add logic to the templates.
 * @param {object} app Express.js app to be configured.
 */
e12e.setup = function (app) {
  if (app && app.locals)
    app.locals.e12e = {
      env : e12e.env,
      isProduction : e12e.isProduction,
      isDevelopment : e12e.isDevelopment,
      isTest : e12e.isTest,
      isStage : e12e.isStage
    };
  else throw(new Error('`app` should be an Express.js app.'))
};


/**
 * Retorna o valor adequado de determinado objeto para o ambiente no qual
 * o código esta sendo executado.
 *
 * @param {Object} map Objeto que mapeia valores para cada ambiente.
 * @return {*} Valor atribuído ao ambiente.
 *
 * @private
 */
function environmentize_(map) {
  var ENV = e12e.env;
  var val = _.isUndefined(map[ENV]) ? map['other'] : map[ENV];
  return _.isFunction(val) ? val() : val;
}
