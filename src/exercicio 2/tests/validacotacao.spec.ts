import csvToJson from "csvtojson";
import HttpApi from "../../config/HttpApi";

describe('Validar API pública do Banco Central - Endpoint que fornece dados de cotação diária de moedas', () => {
  const httpApiBcb = new HttpApi('https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/');

  test('Validar que a resultado possui as propriedades cotacaoCompra e cotacaoVenda - Data format text/plain', async function () {
    const result = await httpApiBcb.getApi().get('/CotacaoDolarDia(dataCotacao=@dataCotacao)',
      { params: { "@dataCotacao": "'08-29-2022'", '$format': 'text/plain' } }
    );
    expect(result.status).toEqual(200);
    const dataJson = await csvToJson().fromString(result.data);
    for (const cotacao of dataJson) {
      expect(cotacao).toHaveProperty('cotacaoCompra');
      expect(cotacao).toHaveProperty('cotacaoVenda');
    }
  });

  test('Validar que a cotação não pode ser negativa - Data format text/plain', async function () {
    const result = await httpApiBcb.getApi().get('/CotacaoDolarDia(dataCotacao=@dataCotacao)',
      { params: { "@dataCotacao": "'08-29-2022'", '$format': 'text/plain' } }
    );
    expect(result.status).toEqual(200);
    const dataJson = await csvToJson().fromString(result.data);
    for (const cotacao of dataJson) {
      const cotacaoCompra = parseFloat(cotacao['cotacaoCompra'].replace(',', '.'));
      const cotacaoVenda = parseFloat(cotacao['cotacaoVenda'].replace(',', '.'));
      expect(cotacaoCompra).toBeGreaterThanOrEqual(0);
      expect(cotacaoVenda).toBeGreaterThanOrEqual(0);
    }
  });

  test('Validar que os valores da cotação possuem o formato correto, casas decimais separado por vírgula e 4 casas decimais', async function () {
    const result = await httpApiBcb.getApi().get('/CotacaoDolarDia(dataCotacao=@dataCotacao)',
      { params: { "@dataCotacao": "'08-29-2022'", '$format': 'text/plain' } }
    );
    expect(result.status).toEqual(200);
    const dataJson = await csvToJson().fromString(result.data);
    const regex = new RegExp("^\\d+,\\d{4}$");
    for (const cotacao of dataJson) {
      const validaFormatCotacaoCompra = regex.test(cotacao['cotacaoCompra']);
      const validaFormatCotacaoVenda = regex.test(cotacao['cotacaoVenda']);
      expect(validaFormatCotacaoCompra).toBeTruthy();
      expect(validaFormatCotacaoVenda).toBeTruthy();
    }
  });
});