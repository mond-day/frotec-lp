function p(texto: string): string {
  return `<p>${texto}</p>`;
}
function h(texto: string): string {
  return `<h2>${texto}</h2>`;
}

export function htmlAnexosFixos(): string {
  return [
    h("ANEXO II — SERVIÇOS INCLUÍDOS, ADICIONAIS E EXCLUÍDOS"),
    p("Os componentes abrangidos e os limites quantitativos abaixo são PROVISÓRIOS e devem ser validados tecnicamente antes do uso comercial."),
    p("Os limites são apurados por veículo e por Ciclo Técnico, na forma do item 17.7, e delimitam o objeto contratado, não constituindo teto indenizatório de qualquer espécie."),
    p("1. SERVIÇOS TÉCNICOS CONTINUADOS E PROGRAMADOS"),
    `<table class="jur"><thead><tr><th>Item</th><th>Incluído na mensalidade</th><th>Cobrança adicional</th><th>Regra técnica</th></tr></thead><tbody>
    <tr><td>Gestão técnica da frota e histórico</td><td>Sim</td><td>Não</td><td>Contínua</td></tr>
    <tr><td>Plataforma, evidências e trilha de auditoria</td><td>Sim</td><td>Não</td><td>Contínua</td></tr>
    <tr><td>Central Técnica e autorização de OS</td><td>Sim</td><td>Não</td><td>Contínua</td></tr>
    <tr><td>Gestão e auditoria da Rede Credenciada</td><td>Sim</td><td>Não</td><td>Contínua</td></tr>
    <tr><td>Manutenção preventiva programada</td><td>Sim</td><td>Não</td><td>6 meses ou 60.000 km</td></tr>
    <tr><td>Avaliação Preventiva Programada</td><td>Sim</td><td>Não</td><td>Conforme agenda</td></tr>
    <tr><td>Reavaliação técnica periódica</td><td>Sim</td><td>Não</td><td>12 meses ou 100.000 km</td></tr>
    <tr><td>Verificação Pós-Serviço</td><td>Sim</td><td>Não</td><td>Após encerramento de OS</td></tr>
    <tr><td>Scanner e diagnóstico do pós-tratamento</td><td>Sim</td><td>Não</td><td>Sem limite</td></tr>
    <tr><td>Limpeza e descristalização</td><td>Sim</td><td>Não</td><td>Conforme protocolo</td></tr>
    <tr><td>Vistoria Técnica Inicial</td><td>Não</td><td>Sim</td><td>R$ 1.800,00 por veículo</td></tr>
    <tr><td>Vistoria Técnica Extraordinária</td><td>Não</td><td>Sim</td><td>R$ 1.800,00 por veículo</td></tr>
    </tbody></table>`,
    p("2. COMPONENTES DO SISTEMA ARLA/SCR"),
    `<table class="jur"><thead><tr><th>Componente</th><th>Incluído na mensalidade</th><th>Limite por Ciclo Técnico</th></tr></thead><tbody>
    <tr><td>Catalisador SCR</td><td>Peça e mão de obra</td><td>1 substituição</td></tr>
    <tr><td>Bomba de ARLA</td><td>Peça e mão de obra</td><td>1 substituição</td></tr>
    <tr><td>Módulo / unidade dosadora</td><td>Peça e mão de obra</td><td>1 substituição</td></tr>
    <tr><td>Injetor / dosador de ureia</td><td>Peça e mão de obra</td><td>2 substituições</td></tr>
    <tr><td>Sensores NOx (montante e jusante)</td><td>Peça e mão de obra</td><td>2 substituições no total</td></tr>
    <tr><td>Sensor de nível, temperatura e qualidade do ARLA</td><td>Peça e mão de obra</td><td>2 substituições no total</td></tr>
    <tr><td>Tanque de ARLA</td><td>Peça e mão de obra</td><td>1 substituição</td></tr>
    <tr><td>Filtro do módulo ARLA</td><td>Peça e mão de obra</td><td>Conforme plano preventivo</td></tr>
    <tr><td>Chicotes, conectores e fixações do sistema</td><td>Peça e mão de obra</td><td>Sem limite</td></tr>
    <tr><td>Reprogramação da ECU de pós-tratamento</td><td>Mão de obra</td><td>Sem limite</td></tr>
    <tr><td>Substituição da ECU de pós-tratamento</td><td>Não incluído</td><td>Serviço Adicional</td></tr>
    </tbody></table>`,
    p("3. Excedido o limite quantitativo de qualquer componente no Ciclo Técnico, as intervenções subsequentes constituem Serviço Adicional, submetidas ao fluxo do item 9.4."),
    p("4. O fluido ARLA 32 de uso operacional não integra os Serviços Incluídos, nos termos do item 7.4."),
    p("5. Veículos classificados na faixa C aderem em plano restrito, sem os componentes da tabela 2, na forma do item 5.3."),

    h("ANEXO III — CLASSIFICAÇÃO DE RISCO E CRITÉRIOS TÉCNICOS"),
    p("A classificação decorre da apuração conjunta dos itens do checklist técnico, prevalecendo sempre a faixa mais restritiva apurada."),
    `<table class="jur"><thead><tr><th>Faixa</th><th>Critérios objetivos</th></tr></thead><tbody>
    <tr><td>A</td><td>Ausência de códigos de falha ativos no sistema de pós-tratamento; dosagem dentro de parâmetro; ausência de cristalização relevante; sensores NOx funcionais; ARLA dentro de especificação em aferição por refratômetro; histórico de manutenção comprovado</td></tr>
    <tr><td>B</td><td>Códigos de falha intermitentes de baixa severidade; cristalização leve; desgaste compatível com uso intenso; ausência de comprometimento funcional do sistema</td></tr>
    <tr><td>C</td><td>Códigos de falha ativos de severidade média; cristalização acentuada; sensor com leitura instável; histórico de manutenção incompleto; sistema funcional, porém com risco técnico elevado</td></tr>
    <tr><td>D</td><td>Ausência irregular de ARLA; derate ativo por falha do SCR; vestígio de emulador, supressor ou adulteração; supressão de componente; hodômetro adulterado; falha grave com sistema inoperante</td></tr>
    </tbody></table>`,
    p("PROCEDIMENTO TÉCNICO VERSIONADO"),
    p("Documento aplicável: Procedimento Técnico FROTEC — Sistemas ARLA 32/SCR — Versão 1.0 — Data de vigência: ____/____/________."),
    p("1. As classificações e conclusões técnicas observarão os critérios objetivos deste Anexo e do Procedimento Técnico vigente na data da avaliação, incluindo, conforme aplicável: códigos DTC e respectiva severidade, parâmetros e faixas aceitáveis de leitura de scanner, testes de dosagem, valores de leitura dos sensores, especificações do fabricante, critérios de aferição de qualidade do ARLA, critérios objetivos de cristalização, critérios de identificação de adulteração, documentação e evidências fotográficas mínimas, critérios de reclassificação entre faixas e procedimento de contraprova."),
    p("2. Toda alteração relevante do Procedimento Técnico será versionada, datada e registrada na Plataforma, sendo vedada a aplicação retroativa de critério mais gravoso a ocorrência anterior à sua vigência."),
    p("3. A versão aplicável a cada avaliação, classificação, Ordem de Serviço ou aplicação de exclusão será aquela vigente na data do respectivo fato, ainda que posteriormente substituída."),
    p("4. A versão vigente e o histórico completo de versões do Procedimento Técnico permanecerão acessíveis à CONTRATANTE na Plataforma durante toda a Vigência."),
    p("5. A Plataforma armazenará, para cada versão do Procedimento Técnico, o respectivo número, a data de vigência, o arquivo original ou seu código de integridade (hash), o usuário responsável pela publicação e o histórico de alterações."),
    p("6. Alteração do Procedimento Técnico que implique restrição de direito, redução de escopo ou aumento de ônus para a CONTRATANTE dependerá de acordo escrito entre as Partes, na forma do item 7.5."),

    h("ANEXO IV — TABELA COMERCIAL"),
    p("Os valores abaixo são PROVISÓRIOS e devem ser substituídos pelos valores efetivos, apurados a partir do custo real de componentes e mão de obra, antes do uso comercial."),
    p("1. Vistoria Técnica Inicial: R$ 1.800,00 por veículo, não restituível, na forma dos itens 4.2 e 4.3."),
    p("2. Vistoria Técnica Extraordinária: R$ 1.800,00 por veículo, na forma do item 4.8."),
    p("3. Avaliação Preventiva Programada e Verificação Pós-Serviço: incluídas na mensalidade, sem cobrança adicional."),
    p("4. Mensalidade por veículo, conforme faixa de risco e volume da Frota Aderida:"),
    `<table class="jur"><thead><tr><th>Faixa de risco</th><th>50 a 99 veículos</th><th>100 a 199 veículos</th><th>200 ou mais veículos</th></tr></thead><tbody>
    <tr><td>A</td><td>R$ 480,00</td><td>R$ 432,00</td><td>R$ 393,60</td></tr>
    <tr><td>B</td><td>R$ 590,00</td><td>R$ 531,00</td><td>R$ 483,80</td></tr>
    <tr><td>C — plano restrito</td><td>R$ 720,00</td><td>R$ 648,00</td><td>R$ 590,40</td></tr>
    </tbody></table>`,
    p("5. Desconto por volume: 10% na faixa de 100 a 199 veículos e 18% na faixa de 200 ou mais veículos, já refletidos na tabela acima."),
    p("6. Alçada de autorização emergencial fora da Área Operacional: R$ 2.500,00 por Ordem de Serviço, na forma do item 13.3."),
    p("7. Reajuste: anual, pelo IGP-M/FGV, limitado ao IPCA/IBGE acrescido de 5 pontos percentuais, na forma do item 14.3."),
    p("8. Faturamento: pós-pago, com vencimento no dia 25 de cada mês, referente à competência do mês anterior, com cálculo proporcional no primeiro mês de Ativação de cada veículo."),
    p("9. Serviços Adicionais: orçados caso a caso, aprovados na Plataforma e faturados de forma destacada da mensalidade, na forma dos itens 9.4 e 15.4."),

    h("ANEXO V — RELAÇÃO DE EXCLUSÕES"),
    p("Não integram os Serviços Incluídos, em complemento à Cláusula 10ª, observada em todos os casos a exigência de nexo causal do item 10.2:"),
    p("1. Eventos externos e aleatórios: colisão, capotamento, tombamento, incêndio, explosão, alagamento, queda de raio, evento da natureza, roubo, furto, vandalismo e ato de terceiro."),
    p("2. Sistemas alheios ao pós-tratamento: motor e periféricos, injeção de combustível, turbocompressor, arrefecimento, transmissão, freios, suspensão, sistema elétrico geral, pneus e carroceria."),
    p("3. Sistema EGR e filtro de partículas (DPF), salvo inclusão expressa no Anexo II."),
    p("4. Fluido ARLA 32 de uso operacional."),
    p("5. Serviços de guincho, reboque, remoção, assistência 24 horas, hospedagem, transporte de carga e veículo reserva."),
    p("6. Falhas preexistentes registradas no Laudo Técnico da Vistoria Técnica Inicial."),
    p("7. Danos decorrentes de emulador, supressor, adulteração de módulo, remapeamento não autorizado ou supressão de componente."),
    p("8. Danos decorrentes de uso de ARLA 32 adulterado, contaminado, vencido ou fora de especificação."),
    p("9. Intervenção por oficina não credenciada sem autorização prévia da Central Técnica."),
    p("10. Serviços de regularização exigidos para adesão de veículo classificado na faixa D."),
    p("11. Lucros cessantes, perda de faturamento, multas contratuais perante terceiros e danos indiretos de qualquer natureza."),
    p("12. Manutenção decorrente de recall, campanha de fabricante ou vício amparado por garantia de fábrica."),
    p("13. Substituição da ECU de pós-tratamento, que constitui Serviço Adicional."),

    h("ANEXO VI — ÁREA OPERACIONAL E NÍVEIS DE SERVIÇO"),
    p("A delimitação territorial e os percentuais de disponibilidade abaixo são PROVISÓRIOS e devem ser validados pela operação, que não deve assumir nível de serviço superior à capacidade efetiva da infraestrutura."),
    p("1. ÁREA OPERACIONAL CONTRATADA"),
    p("Município-sede: Sinop/MT."),
    p("Municípios atendidos: [relacionar]."),
    p("Corredores rodoviários atendidos: [relacionar, ex. BR-163, BR-242, MT-220]."),
    p("Veículos localizados fora da Área Operacional sujeitam-se ao procedimento da Cláusula 13ª."),
    p("A relação atualizada das oficinas integrantes da Rede Credenciada será mantida na Plataforma e poderá ser alterada pela FROTEC durante a Vigência, independentemente de aditivo, desde que permaneçam preservadas a capacidade de atendimento da Área Operacional e os níveis de serviço contratados. São elementos contratuais fixos deste Anexo os municípios, os corredores rodoviários, a área geográfica e os níveis de serviço; são elementos dinâmicos a relação de oficinas, suas especialidades, sua disponibilidade e seus horários."),
    p("GARANTIA DE ÁREA OPERACIONAL. A Área Operacional definida neste Anexo constitui obrigação territorial da FROTEC e não pode ser reduzida unilateralmente. A suspensão, o descredenciamento ou a remoção de oficinas da Plataforma não reduz, restringe nem suspende a Área Operacional contratada, cabendo à FROTEC assegurar, por meio de outra oficina credenciada, a continuidade do atendimento e dos níveis de serviço em todo o território abrangido. Qualquer redução da Área Operacional depende de acordo escrito entre as Partes e, na ausência deste, faculta à CONTRATANTE resilir este Contrato sem incidência de multa."),
    p("2. NÍVEIS DE SERVIÇO"),
    `<table class="jur"><thead><tr><th>Etapa</th><th>Prazo ordinário</th><th>Prazo emergencial</th></tr></thead><tbody>
    <tr><td>Triagem da Ordem de Serviço</td><td>24 horas úteis</td><td>4 horas úteis</td></tr>
    <tr><td>Encaminhamento à Rede Credenciada</td><td>24 horas úteis da triagem</td><td>8 horas úteis</td></tr>
    <tr><td>Parecer da Central Técnica após orçamento completo</td><td>48 horas úteis</td><td>12 horas úteis</td></tr>
    <tr><td>Retorno sobre autorização excepcional (Cláusula 13ª)</td><td>24 horas úteis</td><td>6 horas úteis</td></tr>
    </tbody></table>`,
    p("O nível emergencial aplica-se às ocorrências que resultem em redução relevante de potência, derate crítico ou impossibilidade de operação do veículo, na forma do item 12.6."),
    p("3. DISPONIBILIDADE DA PLATAFORMA"),
    p("Disponibilidade mensal mínima: 99,0%, observadas as exclusões do item 12.8 e a regra do item 12.8.1."),
    p("Metodologia de apuração:"),
    p("a) Ferramenta de medição: solução oficial de monitoramento de disponibilidade utilizada pela FROTEC, identificada e consultável na Plataforma, podendo ser substituída durante a Vigência independentemente de aditivo, desde que preservados o ponto e a metodologia de medição deste Anexo."),
    p("b) Ponto de medição: disponibilidade de resposta da aplicação em seu endereço público, verificada em intervalos não superiores a 5 (cinco) minutos."),
    p("c) Janela de apuração: mês-calendário."),
    p("d) Indisponibilidade parcial: considera-se indisponível o período em que funcionalidade essencial — abertura de Ordem de Serviço, upload de evidências ou consulta de frota — estiver inacessível, ainda que outras funcionalidades permaneçam operantes."),
    p("e) Arredondamento: a apuração será feita com duas casas decimais, desprezadas as frações inferiores."),
    p("f) Contestação: a CONTRATANTE poderá contestar a apuração em até 10 (dez) dias corridos do recebimento do relatório mensal, apresentando os elementos que fundamentem a divergência, cabendo à FROTEC responder de forma fundamentada em igual prazo."),
    p("4. SUSPENSÃO DE PRAZOS"),
    p("Os prazos deste Anexo somente têm início após o cumprimento cumulativo das condições do item 12.4 e ficam suspensos, na forma do item 12.5, durante a indisponibilidade comprovada de peça no mercado."),
    p("5. CANAIS E HORÁRIOS DE ATENDIMENTO"),
    p("Plataforma: disponível de forma ininterrupta para abertura de Ordens de Serviço."),
    p("Central Técnica: [horário], de [dia] a [dia]."),
    p("Canal emergencial: [telefone / WhatsApp], com atendimento em [horário]."),

    h("ANEXO VII — ACORDO DE TRATAMENTO DE DADOS PESSOAIS"),
    p("Este Anexo integra o Contrato e disciplina o tratamento de dados pessoais realizado pelas Partes, complementando a Cláusula 24ª."),
    p("1. PAPÉIS DAS PARTES"),
    `<table class="jur"><thead><tr><th>Tratamento</th><th>CONTRATANTE</th><th>FROTEC</th></tr></thead><tbody>
    <tr><td>Dados de motoristas e prepostos da frota</td><td>Controladora</td><td>Operadora</td></tr>
    <tr><td>Dados de contato dos responsáveis da CONTRATANTE</td><td>Controladora</td><td>Operadora</td></tr>
    <tr><td>Auditoria técnica e prevenção à fraude</td><td>—</td><td>Controladora</td></tr>
    <tr><td>Cumprimento de obrigação legal ou regulatória</td><td>Controladora</td><td>Controladora</td></tr>
    <tr><td>Dados de usuários da Plataforma e logs de acesso</td><td>—</td><td>Controladora</td></tr>
    </tbody></table>`,
    p("2. FINALIDADES"),
    p("a) execução dos serviços de gestão técnica e manutenção contratados;"),
    p("b) identificação do condutor responsável pelo veículo em cada ocorrência técnica;"),
    p("c) rastreabilidade das Ordens de Serviço e das evidências técnicas;"),
    p("d) auditoria técnica, prevenção e apuração de fraude;"),
    p("e) atendimento a obrigação legal, regulatória e fiscal;"),
    p("f) comunicação operacional entre as Partes e a Rede Credenciada."),
    p("3. CATEGORIAS DE DADOS E TITULARES"),
    p("Titulares: empregados, motoristas, prepostos e representantes da CONTRATANTE; avaliadores técnicos; usuários da Plataforma; prepostos das oficinas credenciadas."),
    p("Categorias: nome, cargo ou função, dados de contato profissional, número de registro funcional quando aplicável, dados de identificação do veículo associado, rota e base operacional, registros de acesso e logs, imagens captadas em vistorias e Ordens de Serviço quando contiverem pessoas identificáveis."),
    p("Não há tratamento de dados pessoais sensíveis, salvo se expressamente acordado em aditivo."),
    p("4. SUBOPERADORES"),
    p("A FROTEC poderá utilizar suboperadores, notadamente oficinas da Rede Credenciada, provedores de infraestrutura em nuvem, provedor de assinatura eletrônica e provedores de comunicação, obrigando-se a impor-lhes obrigações de proteção de dados compatíveis com as deste Anexo e a manter relação atualizada e acessível à CONTRATANTE."),
    p("5. SEGURANÇA, RETENÇÃO E DESCARTE"),
    p("a) controle de acesso por perfil e autenticação individualizada;"),
    p("b) registro de logs de ações críticas, com identificação de usuário, data e hora;"),
    p("c) proteção das URLs e dos arquivos armazenados;"),
    p("d) rotina de backup e política de recuperação;"),
    p("e) retenção dos dados durante a Vigência e pelo prazo necessário ao cumprimento de obrigação legal ou ao exercício regular de direitos;"),
    p("f) eliminação dos dados tratados na qualidade de operadora ao término do Contrato, na forma do item 24.7."),
    p("6. INCIDENTES DE SEGURANÇA"),
    p("Aplicam-se os prazos e o procedimento do item 24.6 e seguintes: comunicação de suboperador e oficina à FROTEC em até 12 horas da ciência; comunicação da FROTEC à CONTRATANTE, quando operadora, em até 24 horas da ciência; cooperação das Partes na investigação, contenção, documentação e eventual comunicação à Autoridade Nacional de Proteção de Dados e aos titulares, observados os prazos da regulamentação aplicável."),
    p("7. DIREITOS DOS TITULARES E COOPERAÇÃO"),
    p("A FROTEC prestará à CONTRATANTE, na qualidade de operadora, a assistência necessária ao atendimento de requisições de titulares, em prazo compatível com o exigido pela legislação, encaminhando-lhe as requisições recebidas diretamente."),
    p("8. TRANSFERÊNCIA INTERNACIONAL"),
    p("Não há transferência internacional de dados prevista. Caso venha a ocorrer em razão de provedor de infraestrutura, a FROTEC informará previamente a CONTRATANTE e adotará mecanismo de transferência admitido pela legislação aplicável."),
    p("9. AUDITORIA"),
    p("A CONTRATANTE poderá, mediante aviso prévio de 30 (trinta) dias e no máximo uma vez por Vigência, solicitar relatório de conformidade ou realizar auditoria documental sobre o tratamento de dados realizado pela FROTEC, preservados o sigilo de terceiros e as informações proprietárias."),
  ].join("\n");
}
