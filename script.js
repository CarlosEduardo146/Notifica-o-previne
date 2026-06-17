            
            const SB_URL  = "https://xuhnxajszpttrnmzysgr.supabase.co";
            const SB_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1aG54YWpzenB0dHJubXp5c2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MjA4NzksImV4cCI6MjA5NTI5Njg3OX0.JlgJ2VyocEZhZoyPoA_544u-O68t_rYi6SI0WiqNUOU";

            const { createClient } = supabase;
            const db = createClient(SB_URL, SB_KEY);

            async function dbSelect(tabela, filtros) {
                let q = db.from(tabela).select("*");
                if (filtros) for (let k in filtros) if (filtros.hasOwnProperty(k)) q = q.eq(k, filtros[k]);
                const { data, error } = await q;
                if (error) { console.error(error); return []; }
                return data || [];
            }

            async function dbInsert(tabela, obj) {
                const { data, error } = await db.from(tabela).insert([obj]).select();
                if (error) { console.error(error); return null; }
                return data && data[0] ? data[0] : null;
            }

            async function dbUpdate(tabela, filtro, changes) {
                let q = db.from(tabela).update(changes);
                for (let k in filtro) if (filtro.hasOwnProperty(k)) q = q.eq(k, filtro[k]);
                const { error } = await q;
                if (error) console.error(error);
            }

            async function dbDelete(tabela, filtro) {
                let q = db.from(tabela).delete();
                for (let k in filtro) if (filtro.hasOwnProperty(k)) q = q.eq(k, filtro[k]);
                const { error } = await q;
                if (error) console.error(error);
            }
            const ESCOLA_SECRETARIA = "SECRETARA MUNICIPAL DE EDUCAÇÃO DE HORIZONTE";
            const ESCOLAS_GLOBAIS = [
                "SECRETARA MUNICIPAL DE EDUCAÇÃO DE HORIZONTE",
                "CONSELHO TUTELAR DE HORIZONTE"
            ];

            function podeVerNomeEscola(user) {
                if (!user) return false;
                if (user.nivel === "admin") return true;
                return (user.escola || "").trim() === ESCOLA_SECRETARIA;
            }

            function exibirEscola(nome, user, html) {
                if (podeVerNomeEscola(user)) return nome || "";
                if (user && nome && (user.escola || "").trim() === nome.trim()) return nome;
                return html ? '<span class="escola-restrita">🔒 Restrito</span>' : "🔒 Restrito";
            }

            function temAcessoGlobal(user) {
                if (!user) return false;
                if (user.nivel === "admin") return true;
                return ESCOLAS_GLOBAIS.includes((user.escola || "").trim());
            }

            const MAPA_TIPO = {
                "Agressão Física":"fisica","Conflito físico":"fisica",
                "Dano físico por meio de arma de fogo":"fisica","Esfaqueamento":"fisica",
                "Negligência":"fisica","Maus-tratos":"fisica","Outro (física)":"fisica",
                "Agressão verbal e xingamentos":"psico","Ameaça":"psico","Chantagem":"psico",
                "Constrangimento":"psico","Exploração":"psico",
                "Exposição de criança ou adolescente a crime violento":"psico",
                "Humilhação":"psico","Intimidação sistemática (Bullying)":"psico",
                "Isolamento":"psico","Manipulação":"psico","Perseguição":"psico",
                "Preconceito contra a pessoa com deficiência":"psico",
                "Vigilância constante":"psico","Outro (psicológica)":"psico",
                "Abuso Sexual":"sexual","Assédio Sexual":"sexual","Estupro":"sexual",
                "Exploração Sexual":"sexual","Importunação Sexual":"sexual",
                "Pornografia Infantil":"sexual","Sexting":"sexual",
                "Tráfico Sexual de Pessoas":"sexual","Outro (sexual)":"sexual",
                "Automutilação":"sexual","Ideação suicida":"sexual",
                "Suicídio consumado":"sexual","Tentativa de suicídio":"sexual",
                "Outro (autoprovocada)":"sexual",
                "Cyberbullying":"virtual","Assédio virtual":"virtual","Invasão de dispositivo":"virtual",
                "Abandono escolar":"virtual","Evasão escolar":"virtual",
                "Gravidez na adolescência":"virtual","Trabalho Infantil":"virtual",
                "Ingestão de bebida alcoólica":"virtual","Porte ilegal de arma":"virtual",
                "Outro (violação de direitos)":"virtual",
                "Calúnia":"moral","Difamação":"moral","Injúria":"moral",
                "Etarismo":"motiv","Gordofobia":"motiv","Racismo":"motiv",
                "Intolerância Religiosa":"motiv","Capacitismo":"motiv",
                "Sexismo":"motiv","Violências às diversidades sexuais e de gênero":"motiv",
                "Xenofobia":"motiv","Outros":"motiv",
                "Criança":"praticou","Adolescente":"praticou","Pai":"praticou",
                "Mãe":"praticou","Responsável":"praticou","Professor":"praticou"
            };

            const ICONE_TIPO = {
                fisica:"🤜",psico:"🧠",sexual:"⚠️",virtual:"💻",moral:"🗣️",motiv:"🎯",praticou:"👤"
            };

            function renderTags(str) {
                if (!str || !str.trim()) return '<span style="color:#999;font-size:12px;">Não informado</span>';
                const itens = str.split(",").map(s => s.trim()).filter(Boolean);
                if (!itens.length) return '<span style="color:#999;font-size:12px;">Não informado</span>';
                return '<div class="tagsTipo">' + itens.map(t => {
                const cat = MAPA_TIPO[t] || "moral";
                return `<span class="tagTipo ${cat}">${ICONE_TIPO[cat]||"•"} ${t}</span>`;
                }).join("") + '</div>';
            }

            const EXCLUIR_MOTIV = ["Racismo","Intolerância Religiosa","Sexismo","Diversidade de gênero","Capacitismo","Outros","Criança","Adolescente","Pai","Mãe","Responsável","Professor"];

            function renderTagsSemMotiv(str) {
                if (!str || !str.trim()) return '<span style="color:#999;font-size:12px;">Não informado</span>';
                const itens = str.split(",").map(s => s.trim()).filter(s => s && !EXCLUIR_MOTIV.includes(s));
                if (!itens.length) return '<span style="color:#999;font-size:12px;">Não informado</span>';
                return '<div class="tagsTipo">' + itens.map(t => {
                const cat = MAPA_TIPO[t] || "moral";
                return `<span class="tagTipo ${cat}">${ICONE_TIPO[cat]||"•"} ${t}</span>`;
                }).join("") + '</div>';
            }

            function parseTipos(str) {
                if (!str || !str.trim()) return [];
                return str.split(",").map(s => s.trim()).filter(Boolean);
            }

            let sessao = null;

            function salvarSessao(u) {
                sessao = u;
                sessionStorage.setItem("u", JSON.stringify(u));
                sessionStorage.setItem("nivel", u.nivel);
            }

            function carregarSessao() {
                if (sessao) return sessao;
                const s = sessionStorage.getItem("u");
                if (s) { try { sessao = JSON.parse(s); } catch(e) { sessao = null; } }
                return sessao;
            }

            function limparSessao() {
                sessao = null;
                sessionStorage.removeItem("u");
                sessionStorage.removeItem("nivel");
            }

            function getNivel() { return sessionStorage.getItem("nivel") || ""; }

            function gerarProtocolo(n) { return "PREV-" + String(n).padStart(4, "0"); }

            function abrirLogin()  { document.getElementById("loginModal").style.display = "flex"; }
            function fecharLogin() { document.getElementById("loginModal").style.display = "none"; }

            async function entrar() {
                const email = document.getElementById("usuario").value.trim();
                const senha = document.getElementById("senha").value.trim();
                const { data, error } = await db.from("usuarios").select("*").eq("email", email).eq("senha", senha).single();
                if (error || !data) { alert("Usuário ou senha inválidos!"); return; }
                if (data.status === "Inativo") { alert("Usuário inativo! Procure o administrador."); return; }
                salvarSessao(data);
                alert("Login realizado!");
                abrirPainel();
            }

            function sair() { limparSessao(); location.reload(); }

            function abrirPainel() {
                const user = carregarSessao();
                const modoPublico = document.getElementById("painel").classList.contains("modoPublicoRegistro");
                if (!modoPublico && !user) { alert("Acesso não autorizado!"); location.reload(); return; }

                document.getElementById("loginModal").style.display = "none";
                document.getElementById("inicio").style.display = "none";
                document.getElementById("painel").style.display = "block";
                document.getElementById("painel").classList.remove("modoPublicoRegistro");

                const sidebar = document.querySelector(".sidebar");
                const topo    = document.querySelector(".topoAdmin");
                const menuUsu = document.querySelector(".usuarioMenu");
                if (sidebar) sidebar.style.display = "";
                if (topo)    topo.style.display = "";
                if (menuUsu) menuUsu.style.display = "flex";

                const menuUsuarios = document.getElementById("menuUsuarios");
                if (menuUsuarios) menuUsuarios.style.display = getNivel() !== "admin" ? "none" : "block";

                if (user) {
                document.getElementById("nomeUsuario").innerText = user.nome;
                document.querySelector(".avatar").innerText = user.nome.charAt(0);
                const sub = document.getElementById("perfilSubtitulo");
                if (sub) sub.innerText = `${user.nivel||""} • ${user.escola||""}`;
                }

                setTimeout(() => abrirAba("dashboard"), 100);
                atualizarBadge();
                atualizarBotaoFlutuante();
            }

            function abrirAba(nome) {
                if (nome === "usuarios" && getNivel() !== "admin") { alert("Acesso permitido apenas para administrador"); return; }
                document.querySelectorAll(".aba").forEach(a => a.style.display = "none");
                const ativa = document.getElementById(nome);
                if (!ativa) return;
                ativa.style.display = "block";
                ativa.style.animation = "none";
                setTimeout(() => ativa.style.animation = "fadeSlide 0.4s", 10);
                if (nome === "dashboard") setTimeout(carregarGraficos, 100);
                if (nome === "relatorios") carregarRelatorios();
                if (nome === "usuarios")  { carregarUsuarios(); atualizarCardsUsuarios(); }
                atualizarBotaoFlutuante();
            }

            let etapaAtual = 0;
            function mostrarEtapa() {
                document.querySelectorAll(".etapa").forEach((e, i) => e.style.display = i === etapaAtual ? "block" : "none");
                document.querySelectorAll(".abaItem").forEach((a, i) => a.classList.toggle("ativa", i === etapaAtual));
            }
            function proximo() { const etapas = document.querySelectorAll(".etapa"); if (etapaAtual < etapas.length - 1) { etapaAtual++; mostrarEtapa(); } }
            function voltar()  { if (etapaAtual > 0) { etapaAtual--; mostrarEtapa(); } }

            function regGoTo(i) {
                const total = 8;
                document.querySelectorAll(".reg-etapa").forEach((el, j) => el.classList.toggle("reg-active", j === i));
                document.querySelectorAll(".rs-step").forEach((el, j) => {
                el.classList.remove("rs-active","rs-done");
                if (j === i) el.classList.add("rs-active");
                else if (j < i) el.classList.add("rs-done");
                });
                for (let j = 0; j < 7; j++) {
                const l = document.getElementById("rl" + j);
                if (l) l.classList.toggle("rs-done", j < i);
                }
                const fill = document.getElementById("regProgressFill");
                if (fill) fill.style.width = ((i + 1) / total * 100).toFixed(1) + "%";
                const sc = document.getElementById("regStepCount");
                if (sc) sc.textContent = `— etapa ${i + 1} de ${total}`;
                const wrap = document.querySelector(".reg-wrap");
                if (wrap) wrap.scrollIntoView({ behavior:"smooth", block:"start" });
            }

            let contadorVitimas = 0;

            function _htmlVitima(idx, uid) {
                const podeDeletar = idx > 1;
                const btnDel = podeDeletar
                ? `<button type="button" class="btn-remover-vitima" onclick="removerVitimaCard('${uid}')">✕ Remover</button>`
                : "";
                const radioRaca = ["Branca","Preta","Parda","Indígena","Amarela"].map(v =>
                `<label class="reg-pill"><input type="radio" name="raca_${uid}" value="${v}"><span class="reg-dot"></span>${v}</label>`).join("");
                const radioSexo = ["Feminino","Masculino","Não informou"].map(v =>
                `<label class="reg-pill"><input type="radio" name="sexo_${uid}" value="${v}"><span class="reg-dot"></span>${v}</label>`).join("");
                const radioGenero = ["Homem Cisgênero","Mulher Cisgênero","Homem Transexual","Mulher Transexual","Travesti","Ignorado","Não se aplica"].map(v =>
                `<label class="reg-pill"><input type="radio" name="identGenero_${uid}" value="${v}"><span class="reg-dot"></span>${v}</label>`).join("");
                const radioOrient = ["Heterossexual","Homossexual","Bissexual","Não se aplica","Ignorado"].map(v =>
                `<label class="reg-pill"><input type="radio" name="orientacao_${uid}" value="${v}"><span class="reg-dot"></span>${v}</label>`).join("");
                const inputStyle = "width:100%;padding:9px 12px;border:1px solid #c8e6a0;border-radius:9px;font-size:13px;box-sizing:border-box;background:#fff;outline:none;";
                const selStyle   = inputStyle;

                return `<div class="vitima-card" id="vitimaCard_${uid}">
                <div class="vitima-card-header">
                    <div class="vitima-card-titulo"><span>${idx}</span> Vítima ${idx}</div>
                    ${btnDel}
                </div>
                <div class="reg-grid">
                    <div class="reg-field reg-grid-full">
                    <span class="reg-label">Nome</span>
                    <input type="text" class="inputVitimaNome" data-uid="${uid}" placeholder="Nome da vítima"
                        style="${inputStyle}" onfocus="this.style.borderColor='#639922'" onblur="this.style.borderColor='#c8e6a0'">
                    </div>
                    <div class="reg-field">
                    <span class="reg-label">Idade</span>
                    <input type="number" class="inputVitimaIdade" data-uid="${uid}" placeholder="Ex: 12"
                        style="${inputStyle}" onfocus="this.style.borderColor='#639922'" onblur="this.style.borderColor='#c8e6a0'">
                    </div>
                    <div class="reg-field">
                    <span class="reg-label">Escolaridade</span>
                    <select class="inputVitimaEscolaridade" data-uid="${uid}" style="${selStyle}">
                        <option>Creche</option><option>Pré-Escola</option>
                        <option>1º ano</option><option>2º ano</option><option>3º ano</option>
                        <option>4º ano</option><option>5º ano</option><option>6º ano</option>
                        <option>7º ano</option><option>8º ano</option><option>9º ano</option>
                        <option>Ensino Médio</option>
                    </select>
                    </div>
                </div>
                <hr class="vitima-divider">
                <div class="vitima-group-label">Raça / cor</div>
                <div class="reg-pill-row" style="margin-bottom:.75rem">${radioRaca}</div>
                <hr class="vitima-divider">
                <div class="vitima-group-label">Sexo</div>
                <div class="reg-pill-row" style="margin-bottom:.75rem">${radioSexo}</div>
                <hr class="vitima-divider">
                <div class="vitima-group-label">Identidade de gênero</div>
                <div class="reg-pill-row" style="margin-bottom:.75rem">${radioGenero}</div>
                <hr class="vitima-divider">
                <div class="vitima-group-label">Orientação sexual</div>
                <div class="reg-pill-row">
                    ${radioOrient}
                    <label class="reg-pill" style="align-items:center;gap:6px">
                    <input type="radio" name="orientacao_${uid}" value="Outro" id="orientacaoOutro_${uid}"
                        onchange="toggleOrientacaoOutroCard('${uid}', this)">
                    <span class="reg-dot"></span>Outro:
                    <input type="text" id="orientacaoOutroTexto_${uid}" placeholder="Especifique..."
                        style="display:none;padding:4px 8px;border:1px solid #ce93d8;border-radius:8px;font-size:12px;outline:none;background:#fdf6ff;width:130px">
                    </label>
                </div>
                </div>`;
            }

            function _renumerarVitimas() {
                document.querySelectorAll("#listaVitimas .vitima-card").forEach((card, i) => {
                const titulo = card.querySelector(".vitima-card-titulo");
                if (titulo) titulo.innerHTML = `<span>${i+1}</span> Vítima ${i+1}`;
                });
            }

            function adicionarVitima() {
                contadorVitimas++;
                const uid   = "v" + contadorVitimas;
                const lista = document.getElementById("listaVitimas");
                if (!lista) return;
                const atual = lista.querySelectorAll(".vitima-card").length;
                const div   = document.createElement("div");
                div.innerHTML = _htmlVitima(atual + 1, uid);
                const card = div.firstElementChild;
                if (card) lista.appendChild(card);
            }

            function removerVitimaCard(uid) {
                const card  = document.getElementById("vitimaCard_" + uid);
                const lista = document.getElementById("listaVitimas");
                if (!lista || !card) return;
                if (lista.querySelectorAll(".vitima-card").length > 1) {
                card.remove();
                _renumerarVitimas();
                }
            }

            function toggleOrientacaoOutroCard(uid, radio) {
                const input = document.getElementById("orientacaoOutroTexto_" + uid);
                if (!input) return;
                input.style.display = radio.checked ? "inline-block" : "none";
                if (!radio.checked) input.value = "";
            }

            function coletarVitimas() {
                return [...document.querySelectorAll("#listaVitimas .vitima-card")].map(card => {
                const uid = card.id.replace("vitimaCard_", "");
                const get = cls => card.querySelector(cls);
                let orientacao = (get(`input[name="orientacao_${uid}"]:checked`) || {}).value || "";
                if (orientacao === "Outro") {
                    const el  = document.getElementById("orientacaoOutroTexto_" + uid);
                    const txt = el ? el.value.trim() : "";
                    orientacao = txt ? "Outro: " + txt : "Outro";
                }
                return {
                    nome:         (get(".inputVitimaNome")  || {}).value?.trim() || "",
                    idade:        (get(".inputVitimaIdade") || {}).value?.trim() || "",
                    escolaridade: (get(".inputVitimaEscolaridade") || {}).value || "",
                    raca:         (get(`input[name="raca_${uid}"]:checked`)       || {}).value || "",
                    sexo:         (get(`input[name="sexo_${uid}"]:checked`)       || {}).value || "",
                    identGenero:  (get(`input[name="identGenero_${uid}"]:checked`)|| {}).value || "",
                    orientacao
                };
                });
            }

            async function salvarNotificacao() {
                const user = carregarSessao() || {};
                const tipos = [];

                document.querySelectorAll("#registros input[type='checkbox']").forEach(c => {
                if (!c.checked) return;
                const val = (id) => (document.getElementById(id) || {}).value?.trim() || "";
                if      (c.id === "checkOutros")       tipos.push(val("outrosTexto") ? "Outros: " + val("outrosTexto") : "Outros");
                else if (c.id === "checkFisicaOutro")  tipos.push(val("fisicaOutroTexto") ? "Outro (física): " + val("fisicaOutroTexto") : "Outro (física)");
                else if (c.id === "checkPsicoOutro")   tipos.push(val("psicoOutroTexto") ? "Outro (psicológica): " + val("psicoOutroTexto") : "Outro (psicológica)");
                else if (c.id === "checkSexualOutro")  tipos.push(val("sexualOutroTexto") ? "Outro (sexual): " + val("sexualOutroTexto") : "Outro (sexual)");
                else if (c.id === "checkMotivOutro")   tipos.push(val("motivOutroTexto") ? "Outros (motivação): " + val("motivOutroTexto") : "Outros (motivação)");
                else if (c.id === "checkAutoOutro")    tipos.push(val("autoOutroTexto") ? "Outro (autoprovocada): " + val("autoOutroTexto") : "Outro (autoprovocada)");
                else if (c.id === "checkViolacaoOutro")tipos.push(val("violacaoOutroTexto") ? "Outro (violação de direitos): " + val("violacaoOutroTexto") : "Outro (violação de direitos)");
                else if (c.value) tipos.push(c.value);
                });

                let vitimas = coletarVitimas();
                if (!vitimas.length) vitimas = [{ nome:"",idade:"",escolaridade:"",raca:"",sexo:"",identGenero:"",orientacao:"" }];

                const nomes  = vitimas.map(v => v.nome).filter(Boolean).join(", ");
                const idades = vitimas.map(v => v.idade).filter(Boolean).join(", ");
                const v0     = vitimas[0] || {};

                const autoresData = [...document.querySelectorAll("#listaAutores .autor-row")].map(row => ({
                nome:    (row.querySelector(".inputAutorNome")    || {}).value?.trim() || "",
                idade:   (row.querySelector(".inputAutorIdade")   || {}).value?.trim() || "",
                relacao: (row.querySelector(".inputAutorRelacao") || {}).value?.trim() || ""
                })).filter(a => a.nome || a.idade || a.relacao);

                const todos = await dbSelect("relatorios");
                const protocolo = gerarProtocolo(todos.length + 1);

                const g = id => (document.getElementById(id) || {}).value || "";

                const denunciaItens = [];
                document.querySelectorAll("#re6 input[type='checkbox']").forEach(c => {
                if (!c.checked) return;
                if (c.id === "checkDenunciaOutro") {
                    const txt = g("denunciaOutroTexto").trim();
                    denunciaItens.push(txt ? "Outro: " + txt : "Outro");
                } else if (c.value) denunciaItens.push(c.value);
                });

                const novo = {
                protocolo,
                escola:            user.escola || "Público",
                data:              g("dataPreenchimento"),
                local:             g("localTipo"),
                local_detalhado:   g("localDetalhado"),
                vitima:            nomes,
                idade:             idades,
                sexo:              v0.sexo         || "",
                raca:              v0.raca         || "",
                identidade_genero: v0.identGenero  || "",
                orientacao:        v0.orientacao   || "",
                escolaridade:      v0.escolaridade || "",
                vitimas_json:      JSON.stringify(vitimas),
                responsavel:       g("responsavel"),
                telefone:          g("telefoneResponsavel"),
                parentesco:        g("parentesco"),
                endereco:          g("enderecoResponsavel"),
                autor:             autoresData.map(a => a.nome).filter(Boolean).join(", "),
                idade_autor:       autoresData.map(a => a.idade).filter(Boolean).join(", "),
                relacao_autor:     autoresData.map(a => a.relacao).filter(Boolean).join(", "),
                tipo:              tipos.join(", "),
                resumo:            g("resumo"),
                denuncia_chegou:   denunciaItens.join(", "),
                encaminhamento:    g("encaminhamento"),
                status_secretaria: "Em andamento",
                status_conselho:   "Em andamento"
                };

                try {
                const res = await dbInsert("relatorios", novo);
                if (!res) { alert("Erro ao salvar notificação! Verifique sua conexão e tente novamente."); return; }
                await adicionarNotificacao("Nova notificação: " + (novo.vitima || "Sem nome"), novo.escola);
                alert("Notificação registrada com sucesso!\nProtocolo: " + protocolo);
                limparFormulario();
                regGoTo(0);
                } catch(err) {
                console.error(err);
                alert("Erro ao salvar notificação: " + (err.message || err));
                }
            }

            function limparFormulario() {
                document.querySelectorAll("#registros input[type='text'],#registros input[type='number'],#registros input[type='date'],#registros textarea")
                .forEach(el => el.value = "");
                document.querySelectorAll("#registros select").forEach(el => el.selectedIndex = 0);
                document.querySelectorAll("#registros input[type='radio'],#registros input[type='checkbox']").forEach(el => el.checked = false);

                ["outrosTexto","fisicaOutroTexto","psicoOutroTexto","sexualOutroTexto",
                "motivOutroTexto","autoOutroTexto","violacaoOutroTexto","denunciaOutroTexto"].forEach(id => {
                const el = document.getElementById(id);
                if (el) { el.style.display = "none"; el.value = ""; }
                });

                contadorVitimas = 0;
                const listaV = document.getElementById("listaVitimas");
                if (listaV) { listaV.innerHTML = ""; adicionarVitima(); }

                const listaA = document.getElementById("listaAutores");
                if (listaA) {
                listaA.querySelectorAll(".autor-row").forEach((r, i) => { if (i > 0) r.remove(); });
                listaA.querySelectorAll("input").forEach(inp => inp.value = "");
                atualizarBotoesRemoverAutor();
                }
            }

            function gerarSenha() { return "12345678"; }

            async function cadastrarUsuario() {
                const nome   = document.getElementById("nome").value;
                const email  = document.getElementById("email").value;
                const nivel  = document.getElementById("nivelUsuario").value;
                const escola = document.getElementById("escola").value;
                const senha  = gerarSenha();
                const res = await dbInsert("usuarios", { nome, email, senha, nivel, escola, status:"Ativo" });
                if (!res) { alert("Erro ao cadastrar (email duplicado?)"); return; }
                alert("Usuário cadastrado!\nSenha: " + senha);
                carregarUsuarios();
                atualizarCardsUsuarios();
            }

            async function carregarUsuarios() {
                const tbody = document.querySelector("#tabelaUsuarios tbody");
                if (!tbody) return;
                const lista = await dbSelect("usuarios");
                tbody.innerHTML = "";
                lista.forEach(u => {
                const linha = tbody.insertRow();
                linha.insertCell(0).innerText = u.nome   || "";
                linha.insertCell(1).innerText = u.escola || "";
                linha.insertCell(2).innerText = u.email  || "";
                linha.insertCell(3).innerText = u.senha  || "";
                linha.insertCell(4).innerText = u.nivel  || "";
                linha.insertCell(5).innerHTML = `<span class="${u.status==="Ativo"?"statusAtivo":"statusInativo"}">${u.status||"Ativo"}</span>`;
                linha.insertCell(6).innerHTML =
                    '<button class="botaoAcao botaoEditar"  onclick="editarUsuario(this)">Editar</button>' +
                    '<button class="botaoAcao botaoStatus"  onclick="mudarStatus(this)">Status</button>' +
                    `<button class="botaoAcao botaoExcluir" onclick="excluirUsuario('${u.email}')">Excluir</button>`;
                });
            }

            async function atualizarCardsUsuarios() {
                const lista = await dbSelect("usuarios");
                let total=0, ativos=0, inativos=0, admins=0;
                lista.forEach(u => {
                total++;
                u.status === "Ativo" ? ativos++ : inativos++;
                if (u.nivel === "admin") admins++;
                });
                const el = id => document.getElementById(id);
                if (el("totalUsuarios"))    el("totalUsuarios").innerText    = total;
                if (el("usuariosAtivos"))   el("usuariosAtivos").innerText   = ativos;
                if (el("usuariosInativos")) el("usuariosInativos").innerText = inativos;
                if (el("admins"))           el("admins").innerText           = admins;
            }

            async function excluirUsuario(email) {
                if (!confirm("Deseja excluir este usuário?")) return;
                await dbDelete("usuarios", { email });
                carregarUsuarios(); atualizarCardsUsuarios();
            }

            async function mudarStatus(btn) {
                const linha     = btn.parentElement.parentElement;
                const email     = linha.children[2].innerText;
                const atual     = linha.children[5].innerText.trim();
                const novoSt    = atual === "Ativo" ? "Inativo" : "Ativo";
                await dbUpdate("usuarios", { email }, { status: novoSt });
                carregarUsuarios();
            }

            function editarUsuario(btn) {
                const linha = btn.parentElement.parentElement;
                document.getElementById("nome").value  = linha.children[0].innerText;
                document.getElementById("email").value = linha.children[2].innerText;
                linha.remove();
            }

            function pesquisarUsuario() {
                const termo = (document.getElementById("pesquisaUsuario") || {}).value?.toLowerCase().trim() || "";
                document.querySelectorAll("#tabelaUsuarios tbody tr").forEach(l => {
                l.style.display = l.innerText.toLowerCase().includes(termo) ? "" : "none";
                });
            }

            async function obterRelatoriosFiltrados() {
                const user  = carregarSessao() || {};
                const lista = await dbSelect("relatorios");
                if (temAcessoGlobal(user)) return lista;
                return lista.filter(r => r.escola === user.escola);
            }

            async function carregarRelatorios() {
                const fw = document.getElementById("filtroEscolaWrap");
                if (fw) fw.style.display = "none";
                const user  = carregarSessao() || {};
                const lista = await obterRelatoriosFiltrados();
                lista.sort((a, b) => {
                const na = parseInt((a.protocolo||"").replace(/\D/g,""))||0;
                const nb = parseInt((b.protocolo||"").replace(/\D/g,""))||0;
                return na - nb;
                });
                const tbody = document.querySelector("#tabelaRelatorios tbody");
                if (!tbody) return;
                tbody.innerHTML = "";
                lista.forEach(r => renderLinhaRelatorio(tbody, r, user));
            }

            async function relatorioMensal() {
                const user     = carregarSessao() || {};
                const lista    = await obterRelatoriosFiltrados();
                const mesAtual = new Date().getMonth() + 1;
                const tbody    = document.querySelector("#tabelaRelatorios tbody");
                tbody.innerHTML = "";
                lista.filter(r => (new Date(r.data).getMonth() + 1) === mesAtual)
                .sort((a,b) => (parseInt((a.protocolo||"").replace(/\D/g,""))||0) - (parseInt((b.protocolo||"").replace(/\D/g,""))||0))
                .forEach(r => renderLinhaRelatorio(tbody, r, user));
            }

            async function relatorioVitimas() {
                const user  = carregarSessao() || {};
                const lista = await obterRelatoriosFiltrados();
                const tbody = document.querySelector("#tabelaRelatorios tbody");
                tbody.innerHTML = "";
                lista.sort((a,b) => (parseInt((a.protocolo||"").replace(/\D/g,""))||0)-(parseInt((b.protocolo||"").replace(/\D/g,""))||0))
                .forEach(r => renderLinhaRelatorio(tbody, r, user));
            }

            async function relatorioEscola() {
                const user = carregarSessao() || {};
                const lista = await obterRelatoriosFiltrados();
                if (!podeVerNomeEscola(user)) {
                const tbody = document.querySelector("#tabelaRelatorios tbody");
                tbody.innerHTML = "";
                lista.forEach(r => renderLinhaRelatorio(tbody, r, user));
                return;
                }
                const escolas = [...new Set(lista.map(r => r.escola).filter(Boolean))].sort();
                const wrap = document.getElementById("filtroEscolaWrap");
                const sel  = document.getElementById("selectEscolaRelatorio");
                if (wrap && sel) {
                sel.innerHTML = "";
                if (temAcessoGlobal(user)) sel.innerHTML += '<option value="">Todas as escolas</option>';
                escolas.forEach(e => {
                    const opt = document.createElement("option");
                    opt.value = e; opt.textContent = e;
                    if (!temAcessoGlobal(user) && e === user.escola) opt.selected = true;
                    sel.appendChild(opt);
                });
                wrap.style.display = "block";
                }
                aplicarFiltroEscola();
            }

            async function aplicarFiltroEscola() {
                const user     = carregarSessao() || {};
                const lista    = await obterRelatoriosFiltrados();
                const sel      = document.getElementById("selectEscolaRelatorio");
                const escolhida= sel ? sel.value : "";
                const tbody    = document.querySelector("#tabelaRelatorios tbody");
                if (!tbody) return;
                tbody.innerHTML = "";
                const filtrado = (escolhida ? lista.filter(r => r.escola === escolhida) : lista)
                .sort((a,b)=>(parseInt((a.protocolo||"").replace(/\D/g,""))||0)-(parseInt((b.protocolo||"").replace(/\D/g,""))||0));
                filtrado.forEach(r => renderLinhaRelatorio(tbody, r, user));
                const res = document.getElementById("resultadoRelatorio");
                if (res) res.innerHTML = filtrado.length > 0
                ? `<p style="font-size:13px;color:#555;margin-bottom:8px;"><strong>${filtrado.length}</strong> registro${filtrado.length>1?"s":""} encontrado${filtrado.length>1?"s":""}${escolhida?" para <em>"+escolhida+"</em>":""}</p>`
                : '<p style="color:#c62828;font-size:13px;">Nenhum registro encontrado para esta escola.</p>';
            }

            function renderLinhaRelatorio(tbody, r, user) {
                const protocolo = r.protocolo || "";
                const tr = document.createElement("tr");

                const td = (conteudo, html) => {
                const el = document.createElement("td");
                if (html) el.innerHTML = conteudo; else el.textContent = conteudo;
                return el;
                };

                const stSec  = r.status_secretaria || "Em andamento";
                const stCon  = r.status_conselho   || "Em andamento";
                const podeSec = podeAlterarStatusSecretaria(user);
                const podeCon = podeAlterarStatusConselho(user);

                const colStatusSec =
                `<div style="display:flex;flex-direction:column;gap:4px;align-items:flex-start">` +
                `<span style="font-size:10px;font-weight:700;color:#185fa5;text-transform:uppercase;letter-spacing:.04em">Secretaria</span>` +
                `<span class="${stSec==="Concluído"?"statusAtivo":"statusInativo"}">${stSec}</span>` +
                (podeSec ? `<button class="botaoAcao botaoEditar" style="font-size:11px;padding:2px 7px;margin-top:2px" onclick="alterarStatusSecretaria('${protocolo}')">Alterar</button>` : "") +
                `</div>`;

                const colStatusCon =
                `<div style="display:flex;flex-direction:column;gap:4px;align-items:flex-start">` +
                `<span style="font-size:10px;font-weight:700;color:#639922;text-transform:uppercase;letter-spacing:.04em">Conselho Tutelar</span>` +
                `<span class="${stCon==="Concluído"?"statusAtivo":"statusInativo"}">${stCon}</span>` +
                (podeCon ? `<button class="botaoAcao botaoEditar" style="font-size:11px;padding:2px 7px;margin-top:2px" onclick="alterarStatusConselho('${protocolo}')">Alterar</button>` : "") +
                `</div>`;

                const tdAcoes = document.createElement("td");
                const btnPDF  = document.createElement("button");
                btnPDF.className = "botaoAcao botaoEditar";
                btnPDF.textContent = "PDF";
                btnPDF.onclick = () => relatorioIndividual(protocolo);
                const btnDel  = document.createElement("button");
                btnDel.className = "botaoAcao botaoExcluir";
                btnDel.textContent = "Excluir";
                btnDel.onclick = () => deletarRegistro(protocolo);
                tdAcoes.appendChild(btnPDF);
                tdAcoes.appendChild(btnDel);

                [
                td(protocolo),
                td(exibirEscola(r.escola, user, true), true),
                td(r.data || ""),
                td(r.vitima || ""),
                td(renderTagsSemMotiv(r.tipo), true),
                td(colStatusSec, true),
                td(colStatusCon, true),
                tdAcoes
                ].forEach(c => tr.appendChild(c));

                tbody.appendChild(tr);
            }

            async function alterarStatusSecretaria(protocolo) {
                const user = carregarSessao() || {};
                if (!podeAlterarStatusSecretaria(user)) { alert("Apenas a Secretaria Municipal de Educação pode alterar este status."); return; }
                const lista = await dbSelect("relatorios", { protocolo });
                if (!lista.length) return;
                const novo = (lista[0].status_secretaria || "Em andamento") === "Concluído" ? "Em andamento" : "Concluído";
                await dbUpdate("relatorios", { protocolo }, { status_secretaria: novo });
                alert("Status da Secretaria agora é: " + novo);
                carregarRelatorios();
            }

            async function alterarStatusConselho(protocolo) {
                const user = carregarSessao() || {};
                if (!podeAlterarStatusConselho(user)) { alert("Apenas o Conselho Tutelar pode alterar este status."); return; }
                const lista = await dbSelect("relatorios", { protocolo });
                if (!lista.length) return;
                const novo = (lista[0].status_conselho || "Em andamento") === "Concluído" ? "Em andamento" : "Concluído";
                await dbUpdate("relatorios", { protocolo }, { status_conselho: novo });
                alert("Status do Conselho Tutelar agora é: " + novo);
                carregarRelatorios();
            }

            async function alterarStatus(protocolo) {
                const lista = await dbSelect("relatorios", { protocolo });
                if (!lista.length) return;
                const novo = (lista[0].status || "Em andamento") === "Concluído" ? "Em andamento" : "Concluído";
                await dbUpdate("relatorios", { protocolo }, { status: novo });
            }

            async function deletarRegistro(protocolo) {
                if (!confirm("Deseja realmente excluir este registro?")) return;
                await dbDelete("relatorios", { protocolo });
                carregarRelatorios();
            }

            async function buscarRegistro() {
                const termo = document.getElementById("buscaProtocolo").value.trim().toLowerCase();
                const div   = document.getElementById("resultadoConsulta");
                const user  = carregarSessao() || {};

                if (!termo) {
                div.innerHTML = '<div class="estado-vazio-novo"><div class="estado-vazio-icone-novo">🔍</div><h3>Pronto para buscar</h3><p>Digite o protocolo ou nome da vítima para localizar um registro.</p></div>';
                return;
                }

                div.innerHTML = '<div class="search-card-novo skeleton-novo"><div class="skel-block-novo" style="width:40%;height:16px"></div><div class="skel-block-novo" style="width:100%;height:80px;margin-top:8px"></div></div>';

                const lista = await obterRelatoriosFiltrados();
                const resultados = lista.filter(r =>
                (r.protocolo||"").toLowerCase().includes(termo) || (r.vitima||"").toLowerCase().includes(termo)
                );

                if (!resultados.length) {
                div.innerHTML = '<div class="estado-erro-novo"><div class="estado-erro-icone-novo">❌</div><h3>Nenhum registro encontrado</h3><p>Verifique o protocolo ou tente outro nome.</p></div>';
                return;
                }

                let html = `<p class="resultados-count-novo"><strong>${resultados.length}</strong> registro${resultados.length>1?"s":""} encontrado${resultados.length>1?"s":""}</p>`;

                resultados.forEach(r => {
                const isOk    = r.status === "Concluído";
                const dataFmt = r.data ? r.data.split("-").reverse().join("/") : "—";
                const idSafe  = (r.protocolo||"").replace(/[^a-zA-Z0-9]/g,"_");

                html += `<div class="card-resultado-novo">
                    <div class="card-resultado-header">
                    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
                        <span class="protocolo-badge-novo">${r.protocolo||""}</span>
                        <span class="escola-info-novo"><i class="fi fi-sr-school"></i> ${podeVerNomeEscola(user) ? (r.escola||"") : exibirEscola(r.escola,user,false)}</span>
                    </div>
                    <span class="${isOk?"status-badge-concluido":"status-badge-andamento"}">${isOk?"✓ Concluído":"⏳ Em andamento"}</span>
                    </div>
                    <div class="card-resultado-body">
                    <div class="card-secao">
                        <div class="card-secao-titulo">📍 Ocorrência</div>
                        <div class="campo-label-novo">Data</div><div class="campo-valor-novo destaque">${dataFmt}</div>
                        <div class="campo-label-novo">Local</div><div class="campo-valor-novo">${r.local||"—"}</div>
                    </div>
                    <div class="card-secao">
                        <div class="card-secao-titulo">👤 Vítima</div>
                        <div class="campo-label-novo">Nome</div><div class="campo-valor-novo destaque">${r.vitima||"—"}</div>
                        <div class="campo-label-novo">Idade / Sexo</div><div class="campo-valor-novo">${r.idade||"—"} anos • ${r.sexo||"—"}</div>
                        <div class="campo-label-novo">Raça / Cor</div><div class="campo-valor-novo">${r.raca||"—"}</div>
                    </div>
                    <div class="card-secao">
                        <div class="card-secao-titulo">⚠️ Tipificação</div>
                        <div id="tags_consulta_${idSafe}"></div>
                        <div style="margin-top:8px">
                        <div style="font-size:10px;font-weight:600;color:#bf360c;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Motivação</div>
                        <div id="tags_motiv_${idSafe}"></div>
                        </div>
                        <div style="margin-top:8px">
                        <div style="font-size:10px;font-weight:600;color:#6a1b9a;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Quem praticou</div>
                        <div id="tags_pratic_${idSafe}"></div>
                        </div>
                    </div>
                    </div>
                    <div class="card-resultado-footer">
                    <button class="btn-acao-novo btn-pdf-novo" onclick="relatorioIndividual('${r.protocolo}')"><i class="fi fi-sr-document"></i> Ver PDF</button>
                    ${temAcessoGlobal(user) ? `<button class="btn-acao-novo ${isOk?"btn-status-ok-novo":"btn-status-and-novo"}" onclick="alterarStatusConsulta('${r.protocolo}')"><i class="fi fi-sr-refresh"></i> Mudar status</button>` : ""}
                    <button class="btn-acao-novo btn-excluir-novo" onclick="if(confirm('Excluir ${r.protocolo}?')) deletarRegistro('${r.protocolo}').then(()=>buscarRegistro())"><i class="fi fi-sr-trash"></i> Excluir</button>
                    </div>
                </div>`;
                });

                div.innerHTML = html;

                const MOTIV_LIST  = ["Racismo","Intolerância Religiosa","Sexismo","Diversidade de gênero","Capacitismo","Outros"];
                const PRATIC_LIST = ["Criança","Adolescente","Pai","Mãe","Responsável","Professor"];

                resultados.forEach(r => {
                const idSafe  = (r.protocolo||"").replace(/[^a-zA-Z0-9]/g,"_");
                const todos   = parseTipos(r.tipo);
                const elTipo  = document.getElementById("tags_consulta_" + idSafe);
                if (elTipo) elTipo.innerHTML = renderTagsSemMotiv(r.tipo);
                const elMotiv = document.getElementById("tags_motiv_" + idSafe);
                if (elMotiv) {
                    const itens = todos.filter(t => MOTIV_LIST.includes(t));
                    elMotiv.innerHTML = itens.length
                    ? '<div class="tagsTipo">' + itens.map(t => `<span class="tagTipo motiv">🎯 ${t}</span>`).join("") + "</div>"
                    : '<span style="color:#999;font-size:12px;">Não informado</span>';
                }
                const elPratic = document.getElementById("tags_pratic_" + idSafe);
                if (elPratic) {
                    const itens = todos.filter(t => PRATIC_LIST.includes(t) || t.startsWith("Outros"));
                    elPratic.innerHTML = itens.length
                    ? '<div class="tagsTipo">' + itens.map(t => `<span class="tagTipo praticou">👤 ${t}</span>`).join("") + "</div>"
                    : '<span style="color:#999;font-size:12px;">Não informado</span>';
                }
                });
            }

            async function alterarStatusConsulta(protocolo) { await alterarStatus(protocolo); buscarRegistro(); }

            const charts = {};

            function criarGrafico(id, cfg) {
                const canvas = document.getElementById(id);
                if (!canvas) return;
                if (charts[id]) charts[id].destroy();
                charts[id] = new Chart(canvas, cfg);
            }

            async function carregarGraficos() {
                const lista  = await obterRelatoriosFiltrados();
                const user   = carregarSessao() || {};
                const global = temAcessoGlobal(user);

                let masc=0, fem=0, outro=0, cri=0, ado=0, adu=0, emAnd=0, conc=0;
                const meses = Array(12).fill(0);
                const tipos  = {}, escolas = {};

                lista.forEach(r => {
                if (r.sexo==="Masculino") masc++; else if (r.sexo==="Feminino") fem++; else outro++;
                const id = parseInt(r.idade);
                if (id<=12) cri++; else if (id<=17) ado++; else adu++;
                if (r.data) meses[new Date(r.data).getMonth()]++;
                r.status==="Concluído" ? conc++ : emAnd++;
                const skip = ["Racismo","Intolerância Religiosa","Sexismo","Diversidade de gênero","Capacitismo","Outros","Criança","Adolescente","Pai","Mãe","Responsável","Professor"];
                if (r.tipo) r.tipo.split(",").map(t=>t.trim()).filter(t=>t&&!skip.includes(t)&&!t.startsWith("Outros:"))
                    .forEach(t => tipos[t] = (tipos[t]||0) + 1);
                if (global && r.escola) escolas[r.escola] = (escolas[r.escola]||0) + 1;
                });

                const total = lista.length;
                const taxa  = total > 0 ? Math.round(conc / total * 100) : 0;
                document.getElementById("totalRegistros").innerText  = total;
                document.getElementById("casosAndamento").innerText  = emAnd;
                document.getElementById("casosConcluidos").innerText = conc;
                const txEl = document.getElementById("taxaConclusao");
                if (txEl) txEl.innerText = taxa + "%";

                const legenda = (id, labels, cores) => {
                const el = document.getElementById(id);
                if (!el) return;
                el.innerHTML = labels.map((l,i) => `<span><b style="background:${cores[i]}"></b>${l}</span>`).join("");
                };

                const tf = { size:11 }, gc = "rgba(0,0,0,0.04)";

                criarGrafico("graficoMes",{type:"line",data:{labels:["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],datasets:[{data:meses,borderColor:"#639922",backgroundColor:"rgba(99,153,34,.07)",tension:.4,fill:true,pointBackgroundColor:"#639922",pointRadius:4,pointHoverRadius:6,borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:gc},ticks:{font:tf}},y:{beginAtZero:true,grid:{color:gc},ticks:{stepSize:1,font:tf}}}}});

                const cSex = ["#378ADD","#D4537E","#B4B2A9"];
                legenda("legSexo",[`Masculino — ${masc}`,`Feminino — ${fem}`,`Não informou — ${outro}`],cSex);
                criarGrafico("graficoSexo",{type:"doughnut",data:{labels:["Masculino","Feminino","Não informou"],datasets:[{data:[masc,fem,outro],backgroundColor:cSex,borderWidth:3,borderColor:"#fff"}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},cutout:"65%"}});

                const cId = ["#639922","#EF9F27","#E24B4A"];
                legenda("legIdade",[`Crianças ≤12 — ${cri}`,`Adolescentes — ${ado}`,`Adultos — ${adu}`],cId);
                criarGrafico("graficoIdade",{type:"bar",data:{labels:["Crianças","Adolescentes","Adultos"],datasets:[{data:[cri,ado,adu],backgroundColor:cId,borderRadius:6,borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,grid:{color:gc},ticks:{stepSize:1,font:tf}},x:{grid:{display:false},ticks:{font:tf}}}}});

                const cSt = ["#EF9F27","#639922"];
                legenda("legStatus",[`Em andamento — ${emAnd}`,`Concluído — ${conc}`],cSt);
                criarGrafico("graficoStatus",{type:"doughnut",data:{labels:["Em andamento","Concluído"],datasets:[{data:[emAnd,conc],backgroundColor:cSt,borderWidth:3,borderColor:"#fff"}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},cutout:"65%"}});

                const top7 = Object.entries(tipos).sort((a,b)=>b[1]-a[1]).slice(0,7);
                criarGrafico("graficoTipos",{type:"bar",data:{labels:top7.map(([k])=>k.length>20?k.slice(0,18)+"…":k),datasets:[{data:top7.map(([,v])=>v),backgroundColor:"#97C459",borderRadius:6,borderWidth:0}]},options:{indexAxis:"y",responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{beginAtZero:true,grid:{color:gc},ticks:{stepSize:1,font:tf}},y:{grid:{display:false},ticks:{font:tf}}}}});

                const secEsc = document.getElementById("secaoEscolas");
                if (podeVerNomeEscola(user) && secEsc) {
                secEsc.style.display = "block";
                const ordsEscolas = Object.entries(escolas).sort((a,b)=>b[1]-a[1]).slice(0,15);
                const labsE = ordsEscolas.map(([k])=>k.length>38?k.slice(0,36)+"…":k);
                const dadosE = ordsEscolas.map(([,v])=>v);
                const w = document.getElementById("wrapEscolas");
                if (w) w.style.height = Math.max(300, ordsEscolas.length * 44 + 60) + "px";
                const palEsc = ["#27500a","#3B6D11","#639922","#97C459","#C0DD97","#185FA5","#378ADD","#85B7EB","#993556","#D4537E","#854F0B","#EF9F27","#534AB7","#7F77DD","#888780"];
                legenda("legEscolas", labsE, palEsc);
                criarGrafico("graficoEscolas",{type:"bar",data:{labels:labsE,datasets:[{data:dadosE,backgroundColor:palEsc.slice(0,dadosE.length),borderRadius:6,borderWidth:0}]},options:{indexAxis:"y",responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{beginAtZero:true,grid:{color:gc},ticks:{stepSize:1,font:tf}},y:{grid:{display:false},ticks:{font:{size:10}}}}}});
                } else if (secEsc) {
                secEsc.style.display = "none";
                }
            }

            async function adicionarNotificacao(texto, escola) {
                await dbInsert("notificacoes", { texto, escola: escola||"Não informada", data: new Date().toLocaleString(), lida: false });
                atualizarBadge();
            }

            async function atualizarBadge() {
                const user  = carregarSessao() || {};
                let lista   = await dbSelect("notificacoes");
                if (!temAcessoGlobal(user)) lista = lista.filter(n => n.escola === user.escola);
                const naoLidas = lista.filter(n => !n.lida).length;
                const badge = document.getElementById("badgeNotif");
                if (!badge) return;
                badge.innerText = naoLidas;
                badge.style.display = naoLidas > 0 ? "flex" : "none";
            }

            async function verNotificacoes() {
                const listEl = document.getElementById("listaNotificacoes");
                if (!listEl) return;
                if (listEl.style.display === "block") { listEl.style.display = "none"; return; }
                const user  = carregarSessao() || {};
                let lista   = await dbSelect("notificacoes");
                if (!temAcessoGlobal(user)) lista = lista.filter(n => n.escola === user.escola);
                listEl.innerHTML = "";
                if (!lista.length) {
                listEl.innerHTML = "<p style='padding:8px;color:#888;font-size:13px'>Nenhuma notificação</p>";
                } else {
                const naoLidas = lista.filter(n => !n.lida).length;
                listEl.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px 6px;border-bottom:1px solid #eee;">
                    <strong style="font-size:13px">Notificações</strong>
                    ${naoLidas > 0 ? '<button onclick="marcarTodasLidas()" style="font-size:11px;padding:3px 8px;border:1px solid #ccc;border-radius:6px;background:#f5f5f5;cursor:pointer;color:#555">Marcar todas como lidas</button>' : ""}
                </div>`;
                lista.forEach(n => {
                    const escolaNot = podeVerNomeEscola(user) ? n.escola : "🔒 Restrito";
                    listEl.innerHTML += `<div style="border-bottom:1px solid #eee;padding:10px;background:${n.lida?"#fff":"#f0f7e6"};display:flex;flex-direction:column;gap:4px;">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                        <strong style="font-size:13px;flex:1">${n.texto}</strong>
                        ${!n.lida ? `<button onclick="marcarLida(${n.id})" style="flex-shrink:0;padding:2px 7px;border:1px solid #639922;border-radius:6px;background:transparent;color:#639922;font-size:11px;cursor:pointer;">✓ Lida</button>` : '<span style="font-size:11px;color:#aaa">✓ Lida</span>'}
                    </div>
                    <small style="color:#888">🏫 ${escolaNot}</small>
                    <small style="color:#aaa">🕒 ${n.data}</small>
                    </div>`;
                });
                }
                listEl.style.display = "block";
            }

            async function marcarLida(id) {
                await dbUpdate("notificacoes", { id }, { lida: true });
                atualizarBadge();
                document.getElementById("listaNotificacoes").style.display = "none";
                verNotificacoes();
            }

            async function marcarTodasLidas() {
                const user  = carregarSessao() || {};
                let lista   = await dbSelect("notificacoes");
                if (!temAcessoGlobal(user)) lista = lista.filter(n => n.escola === user.escola);
                for (const n of lista) if (!n.lida) await dbUpdate("notificacoes", { id: n.id }, { lida: true });
                atualizarBadge();
                document.getElementById("listaNotificacoes").style.display = "none";
                verNotificacoes();
            }

            function toggleMenuUsuario() {
                const menu = document.getElementById("dropdownUsuario");
                if (menu) menu.style.display = menu.style.display === "block" ? "none" : "block";
            }

            window.addEventListener("click", e => {
                const menu = document.getElementById("dropdownUsuario");
                const btn  = document.querySelector(".usuarioMenu");
                if (btn && !btn.contains(e.target) && menu) menu.style.display = "none";
            });

            function abrirPerfil() {
                const user = carregarSessao(); if (!user) return;
                document.getElementById("perfilNome").value = user.nome;
                document.getElementById("emailUsuario").value = user.email;
                const nivelSel = document.getElementById("nivel");
                if (nivelSel) nivelSel.value = user.nivel || "usuario";
                const campoNivel = document.getElementById("campoNivel");
                if (campoNivel) campoNivel.style.display = user.nivel === "admin" ? "" : "none";
                document.getElementById("perfilModal").style.display = "flex";
            }
            function fecharPerfil() { document.getElementById("perfilModal").style.display = "none"; }

            async function salvarPerfil() {
                const user    = carregarSessao();
                const novoNome = document.getElementById("perfilNome").value;
                await dbUpdate("usuarios", { email: user.email }, { nome: novoNome });
                user.nome = novoNome; salvarSessao(user);
                document.getElementById("nomeUsuario").innerText = novoNome;
                alert("Perfil atualizado!"); fecharPerfil();
            }

            function alterarSenha() { document.getElementById("senhaModal").style.display = "flex"; }
            function fecharSenha()   { document.getElementById("senhaModal").style.display = "none"; }

            async function salvarSenha() {
                const atual = document.getElementById("senhaAtual").value;
                const nova  = document.getElementById("novaSenha").value;
                const conf  = document.getElementById("confirmarSenha").value;
                const user  = carregarSessao();
                if (atual !== user.senha) { alert("Senha atual incorreta!"); return; }
                if (nova !== conf)        { alert("As senhas não coincidem!"); return; }
                await dbUpdate("usuarios", { email: user.email }, { senha: nova });
                user.senha = nova; salvarSessao(user);
                alert("Senha alterada com sucesso!"); fecharSenha();
            }

            function abrirRecuperacao() { document.getElementById("modalRecuperar").style.display = "flex"; }
            function fecharRecuperacao() {
                document.getElementById("modalRecuperar").style.display = "none";
                document.getElementById("resultadoRecuperacao").innerHTML = "";
                document.getElementById("emailRecuperar").value = "";
            }

            async function recuperarSenha() {
                const email  = document.getElementById("emailRecuperar").value.trim();
                const output = document.getElementById("resultadoRecuperacao");
                const lista  = await dbSelect("usuarios", { email });
                if (!lista.length) { output.style.color = "#c62828"; output.innerHTML = "❌ E-mail não encontrado"; return; }
                const novaSenha = gerarSenha();
                await dbUpdate("usuarios", { email }, { senha: novaSenha });
                output.style.color = "#2e7d32";
                output.innerHTML   = `✅ Nova senha gerada:<br><br><strong>${novaSenha}</strong>`;
            }

            async function relatorioIndividual(protocolo) {
                const lista = await dbSelect("relatorios", { protocolo });
                if (!lista.length) { alert("Registro não encontrado"); return; }
                const r = lista[0];

                let vitimas = [];
                if (r.vitimas_json) { try { vitimas = JSON.parse(r.vitimas_json); } catch(e) {} }
                if (!vitimas.length) {
                const nomes  = (r.vitima||"").split(",").map(s=>s.trim()).filter(Boolean);
                const idades = (r.idade ||"").split(",").map(s=>s.trim());
                vitimas = nomes.map((nome, i) => ({
                    nome, idade: idades[i]||"",
                    sexo:         i===0?(r.sexo||""):"",
                    raca:         i===0?(r.raca||""):"",
                    identGenero:  i===0?(r.identidade_genero||""):"",
                    orientacao:   i===0?(r.orientacao||""):"",
                    escolaridade: i===0?(r.escolaridade||""):""
                }));
                }

                const jsPDF  = window.jspdf.jsPDF;
                const doc    = new jsPDF();
                const logo   = new Image();
                logo.src     = "prefeitura.png";
                let y        = 0;

                const gerarPDF = () => {
                try { doc.addImage(logo,"PNG",10,5,59,38); } catch(e) {}
                doc.setFont("helvetica","bold"); doc.setFontSize(16);
                doc.text("PREFEITURA MUNICIPAL",105,18,null,null,"center");
                doc.setFontSize(11); doc.text("SISTEMA DE NOTIFICAÇÃO PREVINE",105,26,null,null,"center");
                doc.setFont("helvetica","normal"); doc.setFontSize(9);
                doc.text("RELATÓRIO INDIVIDUAL DE OCORRÊNCIA",105,33,null,null,"center");
                doc.setDrawColor(0); doc.setLineWidth(0.3); doc.line(10,50,200,50);
                y = 60;

                const checkPage = h => { if (y + h > 275) { doc.addPage(); y = 20; } };

                const secao = titulo => {
                    y += 6;
                    doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(0,0,0);
                    doc.text(titulo,105,y,null,null,"center"); y += 6;
                };

                const campo = (label, valor, x, w, h=10) => {
                    doc.setDrawColor(180,180,180); doc.setLineWidth(0.2); doc.rect(x,y,w,h);
                    doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(0,0,0);
                    doc.text((label?label+": ":"")+(valor||""),x+2,y+6);
                };

                const campoFull = (l, v, h=10) => { campo(l,v,10,190,h); y += h+2; };
                const campoDuplo = (l1,v1,l2,v2) => { campo(l1,v1,10,95,10); campo(l2,v2,105,95,10); y += 12; };
                const campoTexto = (_, valor) => {
                    const linhas = doc.splitTextToSize(valor||"Não informado.", 183);
                    const alt    = Math.max(18, linhas.length*5.5+6);
                    doc.setDrawColor(180,180,180); doc.setLineWidth(0.2); doc.rect(10,y,190,alt);
                    doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(0,0,0);
                    doc.text(linhas,12,y+6); y += alt+3;
                };

                secao("DADOS DA OCORRÊNCIA");
                campoFull("Protocolo",r.protocolo);
                campoFull("Data",r.data);
                campoFull("Local",r.local);
                campoFull("Especificação do local",r.local_detalhado);

                vitimas.forEach((v, idx) => {
                    checkPage(80);
                    secao(vitimas.length > 1 ? `DADOS DA VÍTIMA ${idx+1}` : "DADOS DA VÍTIMA");
                    campoFull("Nome",v.nome);
                    campoDuplo("Idade",v.idade,"Sexo",v.sexo);
                    campoDuplo("Raça / Cor",v.raca,"Orientação sexual",v.orientacao);
                    campoDuplo("Identidade de gênero",v.identGenero,"Escolaridade",v.escolaridade);
                });

                checkPage(55); secao("RESPONSÁVEL");
                campoFull("Nome",r.responsavel);
                campoDuplo("Parentesco",r.parentesco,"Telefone",r.telefone);
                campoFull("Endereço",r.endereco);

                checkPage(30); secao("AUTOR DA VIOLÊNCIA");
                campoDuplo("Nome",r.autor,"Idade",r.idade_autor);
                campoFull("Relação com a vítima",r.relacao_autor);

                const todos       = parseTipos(r.tipo);
                const motivList   = ["Racismo","Intolerância Religiosa","Sexismo","Diversidade de gênero","Capacitismo","Outros"];
                const praticList  = ["Criança","Adolescente","Pai","Mãe","Responsável","Professor"];
                const itensTipo   = todos.filter(t => !motivList.includes(t) && !praticList.includes(t) && !t.startsWith("Outros:"));
                const itensMotiv  = todos.filter(t => motivList.includes(t));
                const itensPratic = todos.filter(t => praticList.includes(t) || t.startsWith("Outros"));

                campoFull("Quem praticou",itensPratic.length?itensPratic.join(", "):"Não informado");
                checkPage(30); secao("TIPIFICAÇÃO DA VIOLÊNCIA");
                campoTexto("", itensTipo.length ? "Tipos: " + itensTipo.join(", ") : "Tipos: Não informado");
                checkPage(20); secao("MOTIVAÇÃO DA VIOLÊNCIA");
                campoTexto("", itensMotiv.length ? "Motivação: " + itensMotiv.join(", ") : "Motivação: Não informado");

                checkPage(40); secao("RESUMO DA OCORRÊNCIA");
                campoTexto("",r.resumo);
                checkPage(40); secao("ENCAMINHAMENTO");
                campoTexto("",r.encaminhamento);

                doc.setFontSize(7); doc.setTextColor(150,150,150);
                doc.text("Sistema PREVINE • Documento oficial gerado automaticamente",105,290,null,null,"center");

                const nomeArq = (vitimas[0]&&vitimas[0].nome?vitimas[0].nome:"Vitima").replace(/[^a-zA-Z0-9À-ÿ _-]/g,"").trim();
                doc.save(`PREVINE_${r.protocolo}_${nomeArq}.pdf`);
                };

                logo.onload  = gerarPDF;
                logo.onerror = gerarPDF;
            }

            async function exportarTodosPDF() {
                const user  = carregarSessao() || {};
                const lista = await obterRelatoriosFiltrados();
                if (!lista.length) { alert("Nenhum registro encontrado!"); return; }

                const jsPDF = window.jspdf.jsPDF;
                const doc   = new jsPDF({ orientation:"landscape" });
                const logo  = new Image();
                logo.src    = "prefeitura.png";

                const gerarPDF = () => {
                try { doc.addImage(logo,"PNG",10,3,59,38); } catch(e) {}
                doc.setFont("helvetica","bold"); doc.setFontSize(14); doc.text("PREFEITURA MUNICIPAL",148,15,null,null,"center");
                doc.setFontSize(10); doc.text("SISTEMA DE NOTIFICAÇÃO PREVINE",148,23,null,null,"center");
                doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.text("RELATÓRIO GERAL DE OCORRÊNCIAS",148,29,null,null,"center");
                doc.setDrawColor(0); doc.setLineWidth(0.3); doc.line(10,38,287,38);
                doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(100,100,100);
                doc.text(`Data de geração: ${new Date().toLocaleDateString("pt-BR")}   •   Total de registros: ${lista.length}`,148,44,null,null,"center");
                doc.setTextColor(0,0,0);

                let y   = 52;
                const cols = [
                    {label:"Protocolo",x:10,w:32},{label:"Data",x:44,w:28},
                    {label:"Vítima",x:74,w:70},{label:"Tipo",x:146,w:100},{label:"Status",x:248,w:29}
                ];

                doc.setFillColor(60,60,60); doc.rect(10,y,277,9,"F");
                doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(255,255,255);
                cols.forEach(c => doc.text(c.label,c.x+2,y+6));
                doc.setTextColor(0,0,0); y += 11;

                const skip = ["Racismo","Intolerância Religiosa","Sexismo","Diversidade de gênero","Capacitismo","Outros","Criança","Adolescente","Pai","Mãe","Responsável","Professor"];

                lista.forEach((r, idx) => {
                    const tiposTexto   = parseTipos(r.tipo).filter(t => !skip.includes(t) && !t.startsWith("Outros:")).join(", ") || "Não informado";
                    const tipoLinhas   = doc.splitTextToSize(tiposTexto, 53);
                    const vitimaLinhas = doc.splitTextToSize(r.vitima||"", 48);
                    const alt = Math.max(9, Math.max(tipoLinhas.length,vitimaLinhas.length) * 4.8 + 4);

                    if (y + alt > 195) {
                    doc.addPage(); y = 15;
                    doc.setFillColor(99,153,34); doc.rect(10,y,277,9,"F");
                    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(255,255,255);
                    cols.forEach(c => doc.text(c.label,c.x+2,y+6));
                    doc.setTextColor(0,0,0); y += 11;
                    }

                    if (idx%2===0) { doc.setFillColor(245,248,240); doc.rect(10,y,277,alt,"F"); }
                    doc.setDrawColor(210,210,210); doc.setLineWidth(0.1); doc.rect(10,y,277,alt);
                    doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(0,0,0);

                    const ty = y + 5;
                    doc.text(String(r.protocolo||""),cols[0].x+2,ty);
                    doc.text(String(r.data||""),cols[1].x+2,ty);
                    doc.text(vitimaLinhas,cols[2].x+2,ty);
                    doc.text(tipoLinhas,cols[3].x+2,ty);

                    const ok = r.status === "Concluído";
                    doc.setTextColor(ok?39:133,ok?80:79,ok?10:11);
                    doc.setFont("helvetica","bold"); doc.setFontSize(7);
                    doc.text(r.status||"Em andamento",cols[4].x+2,ty);
                    doc.setTextColor(0,0,0); y += alt;
                });

                doc.setFontSize(7); doc.setTextColor(150,150,150);
                doc.text("Sistema PREVINE • Documento oficial gerado automaticamente",148,202,null,null,"center");
                doc.save("Relatorio_Geral_PREVINE.pdf");
                };

                logo.onload  = gerarPDF;
                logo.onerror = gerarPDF;
            }

            function atualizarBotaoFlutuante() {
                const btn = document.querySelector(".botaoFlutuante");
                if (!btn) return;
                const painelAberto = document.getElementById("painel")?.style.display === "block";
                btn.style.display = (painelAberto && !!carregarSessao()) ? "flex" : "none";
            }

            function abrirNovoRegistroAtalho() {
                abrirAba("registros");
                etapaAtual = 0; mostrarEtapa();
                window.scrollTo({ top:0, behavior:"smooth" });
                atualizarBotaoFlutuante();
            }

            function adicionarAutor() {
                const lista = document.getElementById("listaAutores");
                if (!lista) return;
                const div = document.createElement("div");
                div.className  = "autor-row";
                div.style.cssText = "display:grid;grid-template-columns:1fr 80px 1fr auto;gap:8px;margin-bottom:8px;align-items:end";
                div.innerHTML =
                '<div><span style="font-size:11px;color:#888;display:block;margin-bottom:3px">Nome</span><input type="text" class="inputAutorNome" placeholder="Nome (se conhecido)" style="width:100%;padding:8px 10px;border:1px solid #ddd;border-radius:8px;font-size:13px;box-sizing:border-box"></div>' +
                '<div><span style="font-size:11px;color:#888;display:block;margin-bottom:3px">Idade</span><input type="number" class="inputAutorIdade" placeholder="—" style="width:100%;padding:8px 10px;border:1px solid #ddd;border-radius:8px;font-size:13px;box-sizing:border-box"></div>' +
                '<div><span style="font-size:11px;color:#888;display:block;margin-bottom:3px">Relação com a vítima</span><input type="text" class="inputAutorRelacao" placeholder="Ex: colega, familiar..." style="width:100%;padding:8px 10px;border:1px solid #ddd;border-radius:8px;font-size:13px;box-sizing:border-box"></div>' +
                '<div style="padding-bottom:2px"><button type="button" onclick="removerAutor(this)" style="padding:8px 10px;border:1px solid #e57373;background:transparent;color:#c62828;border-radius:8px;cursor:pointer;font-size:13px">✕</button></div>';
                lista.appendChild(div);
                atualizarBotoesRemoverAutor();
            }

            function removerAutor(btn) {
                const lista = document.getElementById("listaAutores");
                if (!lista) return;
                if (lista.querySelectorAll(".autor-row").length > 1) {
                btn.closest(".autor-row").remove();
                atualizarBotoesRemoverAutor();
                }
            }

            function atualizarBotoesRemoverAutor() {
                const lista = document.getElementById("listaAutores");
                if (!lista) return;
                const rows  = lista.querySelectorAll(".autor-row");
                rows.forEach((row, i) => {
                const last = row.querySelector("div:last-child");
                if (!last) return;
                if (rows.length > 1) {
                    if (!last.querySelector("button")) {
                    last.innerHTML = '<button type="button" onclick="removerAutor(this)" style="padding:8px 10px;border:1px solid #e57373;background:transparent;color:#c62828;border-radius:8px;cursor:pointer;font-size:13px">✕</button>';
                    }
                } else if (i === 0) { last.innerHTML = ""; }
                });
            }

            function toggleOutros(cb) {
                const el = document.getElementById("outrosTexto");
                if (el) { el.style.display = cb.checked ? "block" : "none"; if (!cb.checked) el.value = ""; }
            }

            const _toggleExtra = (cb, id) => {
                const el = document.getElementById(id);
                if (el) { el.style.display = cb.checked ? "inline-block" : "none"; if (!cb.checked) el.value = ""; }
            };

            function toggleFisicaOutro(cb)  { _toggleExtra(cb, "fisicaOutroTexto"); }
            function togglePsicoOutro(cb)   { _toggleExtra(cb, "psicoOutroTexto"); }
            function toggleSexualOutro(cb)  { _toggleExtra(cb, "sexualOutroTexto"); }
            function toggleMotivOutro(cb)   { _toggleExtra(cb, "motivOutroTexto"); }
            function toggleAutoOutro(cb)    { _toggleExtra(cb, "autoOutroTexto"); }
            function toggleViolacaoOutro(cb){ _toggleExtra(cb, "violacaoOutroTexto"); }
            function toggleDenunciaOutro(cb){ _toggleExtra(cb, "denunciaOutroTexto"); }

            function toggleSidebar()  { document.querySelector(".sidebar").classList.toggle("aberta"); document.querySelector(".sidebar-backdrop").classList.toggle("aberto"); }
            function fecharSidebar()  { document.querySelector(".sidebar").classList.remove("aberta"); document.querySelector(".sidebar-backdrop").classList.remove("aberto"); }
            
            function toggleSenha(inputId, iconeId) {
                const input  = document.getElementById(inputId);
                const icone  = document.getElementById(iconeId);
                if (!input || !icone) return;
                const visivel = input.type === "text";
                input.type = visivel ? "password" : "text";
                icone.className = visivel ? "fi fi-rr-eye" : "fi fi-rr-eye-crossed";
            }

            function podeAlterarStatusSecretaria(user) {
                if (!user) return false;
                return user.email === "admin@previne.com" ||
                    (user.escola||"").trim() === ESCOLA_SECRETARIA;
            }

            function podeAlterarStatusConselho(user) {
                if (!user) return false;
                return user.email === "admin@previne.com" ||
                    (user.escola||"").trim() === "CONSELHO TUTELAR DE HORIZONTE";
            }

            window.addEventListener("DOMContentLoaded", () => {
                limparFormulario();
                etapaAtual = 0; mostrarEtapa();
                atualizarBotaoFlutuante();
                document.querySelectorAll(".sidebar button").forEach(btn => btn.addEventListener("click", fecharSidebar));
            });

            window.addEventListener("resize", atualizarBotaoFlutuante);
            window.addEventListener("load",   atualizarBotaoFlutuante);