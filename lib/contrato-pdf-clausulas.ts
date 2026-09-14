/** Texto jurídico estático do Contrato Frotec v3.1 (cláusulas e anexos sem dados do cliente). */

function p(texto: string): string {
  return `<p>${texto}</p>`;
}

function h(texto: string): string {
  return `<h2>${texto}</h2>`;
}

export function htmlCorpoContrato(): string {
  return [
    h("CLÁUSULA 1ª — DAS DEFINIÇÕES"),
    p("1.1. Para os fins deste Contrato, os termos abaixo têm o significado que lhes é atribuído nesta cláusula, independentemente de grafados no singular ou no plural:"),
    p("a) Sistema ARLA/SCR: conjunto de componentes destinados ao pós-tratamento de gases de escape por redução catalítica seletiva, conforme relação exaustiva do Anexo II."),
    p("b) Frota Aderida: veículos da CONTRATANTE efetivamente vistoriados, aprovados e ativados neste Contrato, conforme o cadastro eletrônico de que trata o Anexo I."),
    p("c) Ativação: registro eletrônico realizado na Plataforma após a aprovação do veículo na Vistoria Técnica Inicial e o cumprimento das condições comerciais aplicáveis, a partir do qual o veículo integra formalmente a Frota Aderida e passa a gerar mensalidade."),
    p("d) Vistoria Técnica Inicial: avaliação técnica integral do veículo, realizada antes da Ativação, remunerada de forma autônoma."),
    p("e) Vistoria Técnica Extraordinária: nova avaliação técnica integral, exigida nas hipóteses do item 4.7, remunerada de forma autônoma."),
    p("f) Avaliação Preventiva Programada: inspeção técnica inserida na rotina de manutenção preventiva, incluída na mensalidade e que não constitui Vistoria Técnica."),
    p("g) Verificação Pós-Serviço: procedimento de controle de qualidade posterior à execução de Ordem de Serviço, incluído na mensalidade."),
    p("h) Laudo Técnico: documento eletrônico resultante de Vistoria Técnica, contendo diagnóstico, evidências, registro de falhas preexistentes e classificação de risco."),
    p("i) Classificação de Risco: enquadramento do veículo nas faixas A, B, C ou D, conforme critérios do Anexo III e do Procedimento Técnico."),
    p("j) Procedimento Técnico: documento técnico versionado, referenciado pelo Anexo III, que objetiva os parâmetros de avaliação, classificação e diagnóstico."),
    p("k) Rede Credenciada: oficinas contratadas pela FROTEC para execução material dos serviços, relacionadas na Plataforma."),
    p("l) Central Técnica: estrutura da FROTEC responsável por triagem, análise, autorização, auditoria e encerramento das Ordens de Serviço."),
    p("m) Ordem de Serviço (OS): registro eletrônico que documenta a solicitação, a análise, a autorização, a execução e o encerramento de cada intervenção."),
    p("n) Plataforma: sistema web disponibilizado pela FROTEC para gestão da Frota Aderida, das Ordens de Serviço, das evidências e do histórico técnico."),
    p("o) Serviços Incluídos: serviços técnicos continuados, programados e corretivos compreendidos na mensalidade, na forma das Cláusulas 7ª, 8ª e 9ª e do Anexo II."),
    p("p) Serviço Adicional: qualquer serviço, peça, componente, material ou intervenção não compreendido na mensalidade, sujeito a diagnóstico, orçamento e aprovação prévia da CONTRATANTE."),
    p("q) Área Operacional: municípios, corredores rodoviários e bases relacionados no Anexo VI, onde se aplicam os níveis ordinários de serviço."),
    p("r) Ciclo Técnico: período de 12 (doze) meses contado da Ativação de cada veículo, no qual se apuram os limites quantitativos do Anexo II."),
    p("s) Vigência: prazo de duração deste Contrato, na forma da Cláusula 22ª."),

    h("CLÁUSULA 2ª — DO OBJETO E DA NATUREZA JURÍDICA DO CONTRATO"),
    p("2.1. O presente Contrato tem por objeto a prestação continuada, pela FROTEC à CONTRATANTE, de serviços técnicos de gestão de frota, diagnóstico, acompanhamento, manutenção preventiva programada, coordenação e execução de manutenção do Sistema ARLA/SCR, auditoria técnica, gestão da Rede Credenciada e disponibilização de plataforma tecnológica, relativamente aos veículos integrantes da Frota Aderida."),
    p("2.2. A mensalidade prevista neste Contrato remunera os serviços técnicos continuados efetivamente disponibilizados e prestados pela FROTEC durante a Vigência, compreendendo, de forma permanente e recorrente:"),
    p("a) a gestão técnica da Frota Aderida e a manutenção do respectivo histórico;"),
    p("b) o acesso à Plataforma e a manutenção dos registros, evidências e trilha de auditoria;"),
    p("c) a operação da Central Técnica, com triagem, análise e autorização de Ordens de Serviço;"),
    p("d) a construção, o controle e a execução da agenda de manutenção preventiva programada;"),
    p("e) as Avaliações Preventivas Programadas e as Verificações Pós-Serviço;"),
    p("f) o credenciamento, o direcionamento, a auditoria e a gestão da Rede Credenciada;"),
    p("g) a emissão de relatórios técnicos e gerenciais;"),
    p("h) os serviços e componentes expressamente relacionados como incluídos no Anexo II."),
    p("2.3. Este Contrato não tem por objeto a garantia do valor patrimonial dos veículos, a indenização pela ocorrência de evento futuro, a constituição de fundo mutualista, o pagamento de capital ou a assunção genérica ou ilimitada dos riscos inerentes à propriedade ou à operação da frota."),
    p("2.4. As obrigações da FROTEC são cumpridas exclusivamente mediante disponibilização e execução de serviços técnicos e, quando expressamente previsto no Anexo II, mediante instalação de componentes, jamais mediante entrega de valores em dinheiro à CONTRATANTE a título de reparação patrimonial."),
    p("2.5. As intervenções não compreendidas na mensalidade constituem Serviços Adicionais e serão submetidas a diagnóstico, orçamento e autorização específica, na forma da Cláusula 9ª."),
    p("2.6. A natureza jurídica deste Contrato decorre do conteúdo das prestações efetivamente assumidas pelas Partes, obrigando-se ambas a executá-lo em estrita observância ao modelo operacional aqui estabelecido, regendo-se pelos artigos 593 e seguintes do Código Civil."),
    p("2.7. PREVALÊNCIA SOBRE MATERIAL COMERCIAL. Materiais publicitários, apresentações, propostas comerciais e comunicações de venda não integram este Contrato para fins de definição do escopo ou da natureza da prestação, prevalecendo, em qualquer hipótese, o disposto neste instrumento e em seus Anexos. Eventual emprego, em tais materiais, de terminologia estranha a este Contrato não altera a natureza jurídica definida nesta Cláusula."),
    p("2.8. Integram este Contrato, para todos os efeitos: Anexo I (Frota Aderida), Anexo II (Serviços Incluídos, Adicionais e Excluídos), Anexo III (Classificação de Risco e Critérios Técnicos), Anexo IV (Tabela Comercial), Anexo V (Exclusões), Anexo VI (Área Operacional e Níveis de Serviço) e Anexo VII (Acordo de Tratamento de Dados Pessoais)."),

    h("CLÁUSULA 3ª — DAS CONDIÇÕES DE ADESÃO E DA COTA MÍNIMA"),
    p("3.1. A adesão a este Contrato pressupõe a manutenção de, no mínimo, 50 (cinquenta) veículos na Frota Aderida durante toda a Vigência."),
    p("3.2. Somente serão ativados os veículos submetidos à Vistoria Técnica Inicial que obtenham classificação de risco A, B ou C, na forma da Cláusula 5ª."),
    p("3.3. Reduzida a Frota Aderida a número inferior a 50 (cinquenta) veículos, a CONTRATANTE terá 90 (noventa) dias corridos para recompor a cota mínima."),
    p("3.4. Não recomposta a cota mínima no prazo do item 3.3, a manutenção deste Contrato dependerá de acordo escrito entre as Partes quanto ao novo preço aplicável, uma vez que a tabela do Anexo IV foi construída para frotas iguais ou superiores a 50 (cinquenta) veículos."),
    p("3.4.1. Não celebrado o acordo no prazo de 15 (quinze) dias corridos contados do término do prazo do item 3.3, qualquer das Partes poderá resilir este Contrato, sem incidência da multa da Cláusula 22ª, mantendo-se as condições vigentes até a data da resilição."),

    h("CLÁUSULA 4ª — DAS VISTORIAS E AVALIAÇÕES TÉCNICAS"),
    p("4.1. A Vistoria Técnica Inicial é condição de Ativação de cada veículo e será realizada por avaliador técnico designado pela FROTEC, mediante checklist estruturado, registro fotográfico obrigatório, leitura de scanner e verificação dos componentes do Anexo II, observado o Procedimento Técnico vigente."),
    p("4.2. A Vistoria Técnica Inicial constitui serviço autônomo e será remunerada no valor de R$ 1.800,00 (mil e oitocentos reais) por veículo, independentemente do resultado da avaliação."),
    p("4.3. As Partes reconhecem que o valor do item 4.2 remunera a execução do serviço técnico de inspeção e a emissão do Laudo Técnico, e não a aprovação do veículo, não havendo restituição, total ou parcial, em caso de reprovação, de regularização não concluída ou de desistência da CONTRATANTE após a realização da vistoria."),
    p("4.4. A CONTRATANTE obriga-se a disponibilizar os veículos, em local e horário previamente acordados, em condições de inspeção e com a documentação pertinente, sob pena de reagendamento e de cobrança de nova vistoria."),
    p("4.5. AVALIAÇÃO PREVENTIVA PROGRAMADA. As inspeções realizadas no âmbito da manutenção preventiva programada não constituem Vistoria Técnica, estão incluídas na mensalidade e não ensejam cobrança adicional."),
    p("4.6. VERIFICAÇÃO PÓS-SERVIÇO. A verificação destinada à confirmação da qualidade ou da efetividade de serviço executado no âmbito de Ordem de Serviço constitui procedimento de controle interno da FROTEC, está incluída na mensalidade e não enseja cobrança adicional."),
    p("4.7. VISTORIA TÉCNICA EXTRAORDINÁRIA. Consiste em nova avaliação técnica integral do veículo, exigível exclusivamente nas seguintes hipóteses: (i) regularização posterior a reprovação; (ii) reativação após suspensão superior a 90 (noventa) dias; (iii) indício técnico superveniente de adulteração, fraude ou intervenção não autorizada; e (iv) necessidade de reclassificação integral requerida pela CONTRATANTE."),
    p("4.8. A Vistoria Técnica Extraordinária será remunerada no valor de R$ 1.800,00 (mil e oitocentos reais) por veículo, salvo quando expressamente dispensada pela FROTEC em razão de procedimento interno de garantia ou controle de qualidade."),
    p("4.9. Os veículos da Frota Aderida serão submetidos a reavaliação técnica periódica a cada 12 (doze) meses ou a cada 100.000 (cem mil) quilômetros rodados, o que ocorrer primeiro, sem custo adicional, por constituir Avaliação Preventiva Programada."),

    h("CLÁUSULA 5ª — DA CLASSIFICAÇÃO DE RISCO"),
    p("5.1. Concluída a Vistoria Técnica, o veículo será enquadrado em uma das faixas descritas no Anexo III, conforme quadro resumo:"),
    `<table class="jur"><thead><tr><th>Faixa</th><th>Perfil técnico</th><th>Efeito</th></tr></thead><tbody>
    <tr><td>A</td><td>Sistema ARLA/SCR íntegro, sem códigos de falha ativos, manutenção comprovada</td><td>Ativação em plano integral</td></tr>
    <tr><td>B</td><td>Uso intenso ou ressalvas de baixa severidade, sem comprometimento funcional</td><td>Ativação em plano integral, com preço diferenciado</td></tr>
    <tr><td>C</td><td>Risco técnico elevado, porém funcionalmente aceitável</td><td>Ativação em plano restrito (item 5.3)</td></tr>
    <tr><td>D</td><td>Falha grave, ausência irregular de ARLA, indício de adulteração, emulador ou fraude</td><td>Ativação vedada até regularização</td></tr>
    </tbody></table>`,
    p("5.2. A classificação é atribuição da Central Técnica, que poderá confirmar, alterar ou reformar a conclusão do avaliador, sempre mediante parecer técnico fundamentado nos critérios objetivos do Anexo III e do Procedimento Técnico, registrado na Plataforma."),
    p("5.3. O veículo classificado na faixa C poderá ser ativado em plano restrito, limitado aos serviços continuados e à manutenção preventiva programada, excluído o fornecimento de componentes relacionados como incluídos no Anexo II, até que reavaliação promova seu reenquadramento nas faixas A ou B."),
    p("5.4. A CONTRATANTE poderá requerer revisão da classificação em 10 (dez) dias corridos da emissão do Laudo Técnico, mediante contraprova técnica, que será analisada pela Central Técnica em igual prazo, na forma do procedimento de contraprova do Procedimento Técnico."),

    h("CLÁUSULA 6ª — DA REPROVAÇÃO E DA REGULARIZAÇÃO"),
    p("6.1. O veículo classificado na faixa D não será ativado e permanecerá em regularização obrigatória, com indicação, no Laudo Técnico, das providências necessárias."),
    p("6.2. A CONTRATANTE terá 30 (trinta) dias corridos, prorrogáveis por mais 15 (quinze) mediante justificativa aceita pela Central Técnica, para promover a regularização e submeter o veículo a Vistoria Técnica Extraordinária."),
    p("6.3. A regularização poderá ser executada pela Rede Credenciada ou diretamente por terceiro de escolha da CONTRATANTE, constituindo, em qualquer hipótese, serviço não compreendido na mensalidade, cujo custo é integralmente suportado pela CONTRATANTE."),
    p("6.3.1. Optando a CONTRATANTE por terceiro de sua escolha, por se tratar de serviço anterior à Ativação e alheio à gestão contratual da FROTEC, a contratação, o pagamento, a garantia e a responsabilidade pelo serviço ocorrerão diretamente entre a CONTRATANTE e o terceiro contratado, não se aplicando o fluxo centralizado do item 9.4."),
    p("6.3.2. Executada a regularização pela Rede Credenciada, aplica-se integralmente o fluxo do item 9.4 e a garantia da Cláusula 21ª."),
    p("6.4. Decorrido o prazo do item 6.2 sem regularização, o veículo será excluído do processo de adesão, sem incidência de multa, por não ter integrado a Frota Aderida."),
  ].join("\n");
}
