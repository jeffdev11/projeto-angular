![LinkedRH](https://i.imgur.com/D3jd1wk.png)

## COMO CLONAR ESTE REPOSITÓRIO

    git clone {{url}} --depth 30 --recursive (LEIA A OBSERVAÇÃO ANTES DE RODAR ESTE COMANDO)

OBS: Esse comando deve ser utilizado somente por quem tem permissão de acesso de todos os repositórios dos submodules, caso contrário deve ser feito o clone sem a flag --recursive.

Em caso de o usuário git ter acesso somente a alguns submodules, após clonar o repositório root sem a flag --recursive e logo após deve-se utilizar o comando:

    git submodule update --init projects/<nome_do_submodule>

Dica: caso seja necessário saber o nome dos submodules, utilize o comando:

    git submodule

A flag --depth 30 indica que o clone deve ser feito com a profundidade máxima de 30 commits mais recentes, isso é útil para evitar um clone demorado quando já tem um longo histórico de commit.

## COMO RODAR A APLICAÇÃO DEFAULT OU UMA ESPECÍFICA

Para rodar o projeto utilize o comando: "npm run start:default", para rodar uma aplicação específica consulte o arquivo package.json.

## COMO FAZER A BUILD PARA PRODUÇÃO

Para fazer a build de produção utilize o comando:

    npm run build

Existem outras opções de build em que se deve evitar para a produção mas pode ser utilizado para testes:

    npm run no-test-build (cria a build sem rodar os testes automatizados)
    npm run only-build (cria a build sem rodar os testes automatizados e sem rodar o lint)

OBS: Não utilizar o comando "ng build", erros de lint não devem ser corrigidos no processo de build e nem pela pessoa responsável pelo build, é preciso que um desenvolvedor corrija os erros de lint e envie as correções através de um commit.

## COMO CRIAR UMA APLICAÇÃO STANDALONE

As aplicações do tipo Standalone são projetos que possuem a lógica de negócio de uma ou mais funcionalidades do sistema e não poderão ser integradas em outras aplicações diretamente, ou seja, não poderá haver importação de módulos ou outras dependências entre outras aplicações standalone diretamente.

Para criar uma aplicação standalone no workspace deste projeto utilize o comando:

    ng generate application app-std-nome --prefix=app-std-nome

OBS: mantenha o padrão app-std-{{nome}}

Após criar uma aplicação standalone crie as seguintes pastas dentro da pasta "app":

    models-{{nome da aplicação}} (Ex: models-faq)
    pipes-{{nome da aplicação}} (Ex: pipes-faq)
    services-{{nome da aplicação}} (Ex: services-faq)
    shared-{{nome da aplicação}} (Ex: shared-faq)
    state-{{nome da aplicação}} (Ex: states-faq)

## COMO CRIAR UMA APLICAÇÃO DE INTEGRAÇÃO

As aplicações de integração são projetos que tem como objetivo oferecer um meio de integração entre aplicações standalone.

Para criar uma aplicação de integração no workspace deste projeto utilize o comando:

    ng generate application app-int-nome --prefix=app-int-nome

OBS: mantenha o padrão app-int-{{nome}}

## COMO CRIAR UMA BIBLIOTECA

Para criar uma biblioteca no workspace deste projeto utilize o comando:

    ng generate library @libs/lib-nome --prefix=lib-nome

OBS: mantenha o padrão lib-{{nome}}

## O QUE FAZER APÓS CRIAR UMA NOVA APLICAÇÃO OU UMA BIBLIOTECA

Exclua os arquivos karma.config.js e test.ts além disso remova as entradas de "test" do angular.json, isso é necessário pois estamos utilizando o Jest no lugar do Karma e só precisaremos rodar os testes sobre os arquivos de extensão .spec.ts.

Quando for bibliotecas:

Se a biblioteca criada precisar de somente 1 componente então pode utilizar a estrutura que é gerada por padrão, caso a biblioteca tiver a necessidade de ter multiplos componentes siga os seguintes passsos:

    1. Delete todos os arquivos da pasta lib
    2. Crie os componentes dentro da pasta lib, no processo de criação lembre-se de criar o módulo junto com o componente, cada componente terá o seu próprio módulo.

IMPORTANTE: É necessário fazer mais algumas modificações ao criar uma aplicação nova, a primeira é adicionar no arquivo polyfills.ts o seguinte código:

    import '@angular/localize/init';

o segundo passo é adicionar o valor "node" na variável types do arquivo tsconfig.app.json, exemplo:

    "types": ["node"]

no arquivo tsconfig.spec.json é preciso alterar o parametro "jasmine" para "jest", exemplo:

    "types": ["jest"]

Caso a aplicação seja do tipo integração é necessário fazer os seguintes passos:

    No arquivo angular.json verificar se precisa do atributo i18n para internacionalização e se precisa do stylePreprocessorOptions, assets, styles e scripts referente as aplicações standalone.

Caso a aplicação seja do tipo standalone é preciso alterar o nome do módulo raiz de AppModule para AppModule{{nome}} onde {{nome}} é o nome da aplicação, além disso dentro de AppModule{{nome}} deve-se adicionar o seguinte código:

    static forRoot(): ModuleWithProviders<AppModule{{nome}}> {
        return {
            ngModule: AppModule{{nome}},
        };
    }

Isso é necessário para importar o módulo AppModule{{nome}} no arquivo em uma aplicação de integração da seguinte forma:

    AppModule{{nome}}.forRoot()

Outra alteração necessária na aplicação standalone é mudar no arquivo app-routing.module.ts o seguinte código:

    RouterModule.forRoot(routes) para RouterModule.forChild(routes)

Use RouterModule.forRoot(routes) em caso de rodar a aplicação diretamente, somente enquanto em devenvolvimento, para produção ou teste através de uma aplicação de integração é necessário deixar da seguinte forma: RouterModule.forChild(routes)

Apague do arquivo angular.json todos parâmetros de nome "karmaConfig".

Rode o seguinte comando para funcionar o lint:

    ng g @angular-eslint/schematics:add-eslint-to-project {{nome_do_projeto}}

Após rodar este comando adicione o parametro "cache": true na entrada "lint" do arquivo angular.json, exemplo:

    "lint": {
        "builder": "@angular-eslint/builder:lint",
        "options": {
        "cache": true,
        "lintFilePatterns": [
            "projects/{{nome}}/**/*.ts",
            "projects//{{nome}}/**/*.html"
        ]
        }
    }

Adicione a aplicação ou a biblioteca na entrada lint:parallel do arquivo package.json, lembre-se de a cada 6 projetos adicionar "&& parallelshell" para evitar muito uso de recursos do computador.

## COMO ADICIONAR UM SUBMODULE

Para adicionar uma aplicação que está em um repositório externo como um submodule acesse a pasta projects com o comando "cd projects" e depois utilize o comando:

    git submodule add {{url}}

Para evitar problemas de estrutura é recomendado que primeiro a aplicação seja criada dentro do projeto e depois seja transferido seu código para um repositório externo, deletado a pasta desta aplicação deste projeto root e depois esta aplicação que já estará em um repositório externo seja adicionada como submodule. No caso de bibliotecas deverá ser utilizado o repositório libs para todas as bibliotecas que tem a proposta de uma disponibilidade entre várias aplicações.

OBS: Não há necessidade de tratar aplicações de integração como submodules, ou seja, elas podem ficar no repositório raiz mesmo.

## COMO LISTAR OS SUBMODULES DE UM WORKSPACE

    git submodule

## COMO CRIAR COMPONENTES, SERVIÇOS, MÓDUDOS E PIPES EM UMA APLICAÇÃO OU BIBLIOTECA ESPECÍFICA

Para criar módulos, componentes entre outros em um projeto específico utilize a flag --project={{nome_do_projeto}}, por exemplo, para criar um módulo com routing utilize o seguinte comando:

    ng g module {{nome}} --routing --project={{nome da aplicação ou biblioteca}}

Componentes, Serviços e Pipes:

    ng g {{component, service, pipe}} {{nome}} --project={{nome da aplicação ou biblioteca}}

ATENÇÃO: Lembre-se de garantir que o "selector" {{custom-tag}} de cada componente e biblioteca esteja com prefixo haver com o projeto em que foi criado.

## COMO UTILIZAR COMPONENTES DE BIBLIOTECAS

Verifique se o componente está registrado no import do modulo da biblioteca e também está na entrada "exports" deste módulo, além disso importe os componentes utilizando o arquivo public-api.ts do projeto da biblioteca.

## COMO IMPORTAR ESTILOS SCSS DE UMA BIBLIOTECA

Adicione no arquivo angular.json o caminho da pasta que possui os arquivos de estilos, por exemplo:

    "stylePreprocessorOptions": {
        "includePaths": ["projects/libs/lib-ui/src/lib"]
    }

e poderá ser importado da seguinte forma:

    @import "old-styles/includes.scss";

OBS: Neste exemplo existe uma pasta de nome "old-styles" dentro da pasta lib do caminho "projects/libs/lib-ui/src/lib".

## NGXS - GERENCIAMENTO DE ESTADO

O gerenciamento de estado é feito com a biblioteca NGXS https://www.ngxs.io/ (não confundir com o NGRX, não utlizamos NGRX)

Os projetos e opcionalmente módulos terão seu próprio controle de estado dentro de uma pasta de nome "state", esta pasta contém os seguintes arquivos:

    state/{{nome}}.actions.ts (Neste arquivo devemos definir as ações que o state.ts irá utilizar)
    state/{{nome}}.service.ts (Neste arquivo ficará as requisições HTTP que o state.ts irá utilizar)
    state/{{nome}}.state.ts (Neste arquivo devemos definir as variáveis, selectors e actions que poderá ser utilizado pelas aplicações e bibliotecas)

## NGXS - ACTIONS

As actions representam quais tipos de ações poderemos executar para afetar o estado de uma aplicação, segue um exemplo:

    export class AddTodo {
        static readonly type = '[Todo] Add';
        constructor(public payload: any) {}
    }

    export class EditTodo {
        static readonly type = '[Todo] Edit';
        constructor(public payload: any) {}
    }

    export class FetchAllTodos {
        static readonly type = '[Todo] Fetch All';
    }

    export class DeleteTodo {
        static readonly type = '[Todo] Delete';
        constructor(public payload: number) {}
    }

## NGXS - SERVICES

Os serviços devem conter as requisições HTTP que precisam ser feitas pelas ações no arquivo state.ts, exemplo:

    login(request: {
    username: string;
    password: string;
    }): Observable<{ user: User; token: string }> {
        return this.http
        .post<{ user: User; token: string }>(`${URL}/login`, request)
        .pipe(map((res) => res));
    }

## NGXS - STATE

No controle de estado deve conter os selects (consulta do conteúdo das variáveis) e as actions (alterações dos valores das variáveis), exemplo:

    @Selector()
    static currentUser(state: AuthStateModel) {
        return state.currentUser;
    }

    // SEM REQUISIÇÃO HTTP
    @Action(updateCurrentUser)
    updateCurrentUser(
        { patchState }: StateContext<AuthStateModel>,
        { payload }: updateCurrentUser
    ) {
        patchState({ currentUser: payload });
    }

    // COM REQUISIÇÃO HTTP
    @Action(updateCurrentUser)
    updateCurrentUser(
        { patchState }: StateContext<AuthStateModel>,
        { payload }: updateCurrentUser
    ) {
        return this.authService.updateCurrentUser(payload).pipe(
            tap(result => {
                patchState({ currentUser: result });
            })
        );
    }

## NGXS - COMO UTILIZAR O CONTROLE DE ESTADO NOS COMPONENTES

Para acessar dados de um estado, seja para consulta ou para alterações devemos utilizar o serviço Store, então a primeira coisa a sefazer é injetar o serviço no construtor do componente da seguinte forma:

    constructor(private store: Store) {}

Vamos a alguns exemplo de uso desse serviço:

    // OBSERVABLE DA VARIÁVEL DE ESTADO
    @Selector(AuthStateModel.currentUser) currentUser$: Observable<User>;

    // CONSULTA COM SUBSCRIBER
    this.store.select(AuthState.currentUser).subscribe(user => {
        this.currentUser = user;
    });

    // CONSULTA SEM SUBSCRIBER
    this.currentUser = this.store.selectSnapshot(AuthState.currentUser);

    // ALTERAÇÃO
    this.store.dispatch(new updateCurrentUser(user));

## COMO LIDAR COM SUBSCRIPTIONS

Ao fazer uma subscription é importante encerrar a mesma quando o componente for destruído no método ngOnDestroy do componente usando o método unsubscribe, exemplo:

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

Para fazer isso iremos utilizar uma instância da classe Subscription e o método add para controlar as subscriptions, exemplo:

    subs = new Subscription();

    ngOnInit() {
        this.subs.add(this.store.select(AuthState.currentUser).subscribe(user => {
            this.currentUser = user;
        }));

        this.subs.add(...);
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

Outras formas de encerrar uma subscription:

Async Pipe, quando se usa o pipe async ele encerra a subscription automaticamente quando o componente é encerrado:

    <div>
        Interval: {{observable$ | async}}
    </div>

Uso dos operados take\* da biblioteca RxJs:

    take(n) - encerra a subscription após o n-ésimo evento:

        this.subs.add(this.store.select(AuthState.currentUser).pipe(take(1)).subscribe(user => {
            this.currentUser = user;
        }));

    takeUntil(notifier) - encerra a subscription quando o notifier é emitido:

        this.subs.add(this.store.select(AuthState.currentUser).pipe(takeUntil(this.destroy$)).subscribe(user => {
            this.currentUser = user;
        }));

    takeWhile(predicate) - encerra a subscription quando o predicate é falsa:

        this.subs.add(this.store.select(AuthState.currentUser).pipe(takeWhile(() => this.isAlive)).subscribe(user => {
            this.currentUser = user;
        }));

Uso dos operadores first da biblioteca RxJs:

    first() - encerra a subscription após o primeiro evento:

        this.subs.add(this.store.select(AuthState.currentUser).pipe(first()).subscribe(user => {
            this.currentUser = user;
        }));

    first(predicate) - encerra a subscription após o primeiro evento que satisfaz o predicate:

        this.subs.add(this.store.select(AuthState.currentUser).pipe(first(user => user.id === 1)).subscribe(user => {
            this.currentUser = user;
        }));

## CHANGE DETECTION

Para todos os novos componentes que forem criados sem ser os da migração do antigo repositório é necessário adicionar o decorator ChangeDetectionStrategy.OnPush, exemplo:

    @Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush
    })

Isso é necessário para que o Angular não faça a atualização do componente sem necessidade, quando o OnPush é utilizado o change detection só irá executar quando ocorrer os seguintes eventos:

    - a referência do input tiver mudado
    - o componente ou um de seus filhos aciona um event handler
    - a detecção de mudanças é acionada manualmente
    - Um observable linkado no template via pipe async emite um novo valor

É comum a necessidade de rodar manualmente a detecção de mudanças quando estamos utilizando o OnPush, por exemplo, quando estamos utilizando o ngModel para controlar o valor de um input, o ngModel não é um event handler, então não é possível acionar a detecção de mudanças, para isso é necessário rodar a detecção de mudanças manualmente injetando o serviço ChangeDetectorRef no construtor e depois usando o método detectChanges(), exemplo:

    ngOnInit() {
        this.subs.add(this.store.select(AuthState.currentUser).subscribe(user => {
            this.currentUser = user;
            this.changeDetector.detectChanges();
        }));
    }

Existem três métodos para acionar manualmente as detecções de mudanças:

    detectChanges() do serviço ChangeDetectorRef que executa a detecção de mudanças nessa view e seus filhos, mantendo em mente a estratégia de detecção de mudanças. Ele pode ser usado em combinação com o detach() para implementar verificações locais de detecção de mudanças.

    ApplicationRef.tick() que aciona a detecção de mudança para toda a aplicação, respeitando a estratégia de detecção de mudança dos componentes.

    markForCheck() do serviço ChangeDetectorRef que não aciona a detecção de mudanças, mas marca todos os ancestrais OnPush como para serem verificados uma vez, seja como parte do ciclo de detecção de mudanças atual ou próximo. Ele executará a detecção de mudança nos componentes identificados, mesmo que eles estejam usando a estratégia OnPush.

Não se deve fazer chamada de métodos na view para acionar a detecção de mudanças, pois o método será acionado a cada ciclo do CD sem necessidade, quando for necessário utilizar uma lógica mais complexa para apresentação dos dados na view utilize pipes para resolver este problema, eu criei uma pipe de nome GenericCustomHandlerPipe, utilize ela para quando precisar executar a lógica de um método para apresentação na view, exemplo:

    ao invés de:

    [toolTip]="metodo('valor')"

    faça:

    [toolTip]="'valor' | genericCustomHandler : metodo"

caso precise do contexto do método em questão eu já deixei essa pipe preparada para isso, basta utilizar o operador this como segundo argumento, exemplo:

    [toolTip]="'valor' | genericCustomHandler : metodo : this"

além disso eu deixei essa pipe preparada para suportar mais argumentos, exemplo:

    [toolTip]="'valor' | genericCustomHandler : metodo : this : 'arg1' : 'arg2'"

caso nenhum destes cenários atenda o seu requisito basta criar uma nova pipe.

![Change Detection](https://i.imgur.com/8vt6EYn.gif)

![Change Detection](https://i.imgur.com/dk7rDes.gif)

## COMO RODAR O LINT

Para rodar o lint em todos os projetos utilize o comando:

    npm run lint:parallel

Para projetos especificos consulte o arquivo package.json

## SOBRE OS TESTES

Os testes serão executados usando o Jest, para mais detalhes de como foi implementado o Jest neste repositório segue os detalhes do passo a passo de como foi feito:

    Instalação do jest:

    npm install -D jest jest-preset-angular @types/jest

    Foi criado um arquivo setup-jest.ts que contém as configurações de inicialização do Jest.

    Logo após foi inserido as seguintes configurações no package.json:

        "jest": {
            "preset": "jest-preset-angular",
            "setupFilesAfterEnv": ["<rootDir>/setup-jest.ts"],
            "globalSetup": "jest-preset-angular/global-setup"
        }

    O arquivo tsconfig.spec.json foi configurado da seguinte forma:

        {
            "extends": "./tsconfig.json",
            "compilerOptions": {
                "outDir": "./out-tsc/spec",
                "module": "CommonJs",
                "types": ["jest"]
        },
            "include": ["src/**/*.spec.ts", "src/**/*.d.ts"]
        }

## COMO RODAR OS TESTES

Para rodar de forma global utilize o comando "npm run test"
Para rodar sobre uma aplicação específica utilize o comando "npm run test --app='nome_da_aplicação'"

## === OBSERVAÇÕES ===

## PACOTES NPM MIGRADOS

As seguintes bibliotecas npm foram migradas do antigo repositório para este e precisam de revisão para saber se realmente é necessário todas elas ou se existe opções melhores:

    "primeflex": "^3.1.3",
    "primeicons": "^2.0.0",
    "primeng": "12.2.3",
    "@fortawesome/fontawesome-free": "~5.15.3",
    "tinymce": "^5.8.2",
    "moment": "^2.29.1",
    "@ngx-translate/core": "^13.0.0",
    "@tinymce/tinymce-angular": "^4.2.4",
    "vimeo": "^2.1.1",
    "@vimeo/player": "^2.15.3",
    "ngx-webstorage": "^8.0.0",

Duas bibliotecas não foram importadas pois aparentemente não serão necessárias:

    "form-data": "^4.0.0",
    "ngx-webstorage": "^8.0.0",

## SOBRE PROJETOS MIGRADOS

Os projetos migrados possuem otimização tanto em algumas partes do código quanto na forma de como são organizados em seus componentes, serviços, pipes, etc, porém não devem ser utilizados com referências para novas aplicações pois algumas estruturas e códigos tiveram que se manter da forma antiga, os projetos que podem ser utilizados como boas práticas de como deve ser feito são aqueles que principalmente estão como um submodule, para listar os projetos que estão em submodule utilize o comando: git submodule.

## CONFIGURAÇÕES DE INICIALIZAÇÃO PARA ASSETS, STYLES E SCRIPTS

As configurações de inicialização para assets, styles e scripts foram migradas do repositório code anterior para o escopo da aplicação core deste projeto, porém é necessario avaliar a refatoração dessas importações.

Os arquivos da pasta assets e o icone do antigo repositório foram migrados para a aplicação core deste projeto, porém é necessário avaliar essas importações.

## CUIDADO COM IMPORTAÇÕES AUTOMÁTICAS

As importações automáticas não levam em conta o arquivo public-api.ts, caso utilize importação automática verifique se existe alguma importação que precisa ser feita pelo arquivo public-api.ts e acabou sendo importado o arquivo diretamente, caso isso tenha ocorrido basta corrigir o caminho para importar do arquivo public-api.ts.

## HOT MODULE REPLACEMENT

É possível utilizar o recurso de HMR através do comando "npm run start:hmr" para atualizar o código da aplicação sem precisar dar reload na página.

## === RECOMENDAÇÕES ===

## CODE REVIEW

As seguintes situações caso aconteçam devem ter o commit rejeitado no processo do code review:

    - Caso tenha sido criado classes, interfaces ou enums no arquivo .ts que representa um componente Angular, esses arquivos devem ser criados dentro da pasta models do projeto em questão ou em uma biblioteca se for acessado por várias aplicações.

    - Não é permitido a alteração ou a criação de um controle de rotas em que exista o uso da função forRoot no RouterModule, exemplo:

        @NgModule({
            imports: [RouterModule.forRoot(routes)],
            exports: [RouterModule],
        })

    Somente aplicações de integração podem ter o forRoot, para aplicações standalone é necessário usar o forChild no lugar do forRoot.

    - Não é permitido a chamada direta de métodos no html, caso precise usar métodos deve-se usar pipes, aqui no README tem uma sessão que explica como fazer isso.

    - Não pode haver a falta ou a exclusão de arquivos .spec.ts sem um bom motivo.

    - Alterações em versões de bibliotecas no package.json sem a devida comunicação e ciência do time de desenvolvimento.

    - Quando houver importação de CSS que estejam fora do projeto que está importando isso deve ser feito através do stylePreprocessorOptions no arquivo angular.json, aqui no README tem mais explicações de como fazer isso.

    - Quando houver importações de arquivos diversos que estejam fora do projeto que está importando isso deve ser feito diretamente sobre o arquivo public-api.ts do projeto ou biblioteca de origem, não é permitido importação direta aos arquivos, sejam serviços, pipes, componentes, models etc.

    - Todo componente deve ter seu selector com o prefixo do projeto, exemplo:

        @Component({
            selector: 'joinrh-app-std-faq-{component_name}',
            templateUrl: './{component_name}.component.html',
            styleUrls: ['./{component_name}.component.scss'],
        })

    - O uso de gerenciamento de estado deve ser obrigatório para o controle de dados vindos do backend (com uma exceção temporária para os projetos migrados do antigo repositório)

    - Os componentes ao serem finalizados devem possuir testes automatizados (com uma exceção temporária para os projetos migrados do antigo repositório)

    - Alterações nos arquivos package.json e angular.json devem ser aprovadas avaliando com muito cuidado os efeitos colaterais das alterações.

    - Ao criar novos arquivos é preciso avaliar se foi inserido com um nome apropriado e em uma pasta apropriada, é preciso seguir um padrão para isso.

    - Ao fazer bind de diretivas não se deve utilizar interpolation, para por a diretiva entre chaves [diretiva] para fazer bind com alguma variável.

    - É necessário rejeitar códigos que claramente não é uma boa prática, caso o code reviewer perceba que determinado código pode ter uma solução melhor ele deve devolver a tarefa para o desenvolvedor responsável e informar a proposta de solução e/ou melhoria, não se deve devolver a tarefa sem informar uma sugestão de solução e/ou melhoria e também não se deve devolver a tarefa se não tiver certeza que o código é uma má prática e existe uma solução melhor, em caso de dúvidas converse diretamente com o desenvolvedor da tarefa.

## PLUGINS NECESSÁRIOS PARA VS CODE

É preciso ter os seguintes plugins instalados no VS Code:

    - "Better Comments"
    - "ESLint"
    - "Prettier ESLint"
    - "Prettier"
    - "SonarLint"

## FORMATAÇÃO DO CÓDIGO

É preciso utilizar o "ESLint Prettier" como formatador padrão do código, não confundir com o "Prettier".

![ESLint Prettier](https://i.imgur.com/1TC2Lda.png)

## O QUE MIGRAR

Deve-se evitar importar códigos e arquivos do repositório antigos sem clara necessidade, na medida que for migrando cada componente e for tendo dependências é só ir migrando essas dependências, serviços etc, favor não migrar vários arquivos de uma vez.

ATENÇÃO: Não se deve copiar e colar arquivos .ts, .html e .scss, deve-se gerar o componente pelo angular cli e depois migrar o CONTEÚDO destes arquivos.

## ASSETS

Armazene arquivos de mídia preferenciamente na pasta assets de uma aplicação, só utilize a pasta assets do projeto raiz caso faça sentido no contexto deste projeto.

## == PRECISA DE REVIEW ==

    - Na migração do código antigo para o novo foi necessário fazer algumas alterações por causa do modo strict, as alterações com possibilidade de causar algum tipo de bug no funcionamento possuem um comentário na linha acima da alteração, pode ser encontrado pesquisando por [NEED_REVIEW].

    - Mais informações sobre o código antigo e o novo podem ser encontrados no arquivo README.md dentro de cada aplicação e biblioteca, favor ler o README.md do projeto que for trabalhar e também ajudar na melhoria do README.md.

## == README.MD ==

    - Toda aplicação e biblioteca deve ter um README.MD próprio, caso o README.MD não exista, crie um, caso tenha sido gerado com um conteúdo padrão, apague o conteúdo padrão, todo README.MD deve conter informações relevantes para o projeto.

## == CONFIGURAÇÃO DO NGINX ==

É necessário ter o servidor Nginx instalado no computador para funcionar como um proxy para as requisições ao servidor, isso ajuda a resolve tanto problema com CORS quanto faz funcionar o JSF.

Configurações de exemplo:

        location / {
            client_max_body_size 500M;
            proxy_pass http://localhost:4200;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header   Upgrade $http_upgrade;
            proxy_set_header   Connection "upgrade";
            proxy_connect_timeout 7200;
            proxy_send_timeout 7200;
            proxy_read_timeout 7200;
            send_timeout 7200;
        }


        location ~ ^/api {
            client_max_body_size 500M;
            proxy_pass http://192.168.1.31:8080;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header   Upgrade $http_upgrade;
            proxy_set_header   Connection "upgrade";
            proxy_connect_timeout 7200;
            proxy_send_timeout 7200;
            proxy_read_timeout 7200;
            send_timeout 7200;
        }

        location ~ ^/joinrhweb {
            client_max_body_size 500M;
            proxy_pass http://192.168.1.31:8080;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header   Upgrade $http_upgrade;
            proxy_set_header   Connection "upgrade";
            proxy_connect_timeout 7200;
            proxy_send_timeout 7200;
            proxy_read_timeout 7200;
            send_timeout 7200;
        }

É importante acessar o ambiente de desenvolvimento do Angular através do Nginx ao invés de diretamente pela porta 4200, ou seja, ao invés de acessar http://localhost:4200 acesse somente http://localhost
