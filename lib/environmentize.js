var _ = require('underscore');

/**
 * @fileoverview Define helpers para lidar com diferenças de configuração
 *    entre os ambientes de desenvolvimento.
 *
 * @author Mathias Kretschek <mathias@yblok.com>
 * @version 0.0.1
 */

/** Ambiente padrão. */
var DEFAULT_ENV = 'development';


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
module.exports = function () {
  var args = arguments;
  if (args.length === 1 && _.isObject(args[0]))
    return environmentize_(args[0]);
  else if (args.length === 2) {
    var val = {};
    val['production'] = val['staging'] = args[0];
    val['development'] = val['test'] = args[1];
    return environmentize_(val);
  } else throw(Error('Invalid environmentize params.'));
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
  var ENV = process.env.NODE_ENV || DEFAULT_ENV;
  var val = _.isUndefined(map[ENV]) ? map['other'] : map[ENV];
  return _.isFunction(val) ? val() : val;
}
