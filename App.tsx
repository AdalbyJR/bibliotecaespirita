import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Modal,
} from 'react-native';

interface Livro {
  id: string;
  titulo: string;
  autor: string;
  preco: number;
  quantidade: number;
}

interface Venda {
  id: string;
  livroId: string;
  tituloLivro: string;
  quantidade: number;
  valorTotal: number;
  data: string;
}

interface Emprestimo {
  id: string;
  livroId: string;
  tituloLivro: string;
  nomeCliente: string;
  telefone: string;
  dataEmprestimo: string;
  dataRetorno?: string;
  devolvido: boolean;
}

const App = () => {
  const [telaAtual, setTelaAtual] = useState('estoque');

  // Estados para livros
  const [livros, setLivros] = useState<Livro[]>([
    {
      id: '1',
      titulo: 'O Evangelho Segundo o Espiritismo',
      autor: 'Allan Kardec',
      preco: 25.00,
      quantidade: 10
    },
    {
      id: '2',
      titulo: 'O Livro dos Espíritos',
      autor: 'Allan Kardec',
      preco: 30.00,
      quantidade: 8
    },
    {
      id: '3',
      titulo: 'Nosso Lar',
      autor: 'André Luiz / Chico Xavier',
      preco: 20.00,
      quantidade: 15
    }
  ]);

  // Estados para vendas
  const [vendas, setVendas] = useState<Venda[]>([]);

  // Estados para empréstimos
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);

  // Estados para formulários
  const [novoLivro, setNovoLivro] = useState({
    titulo: '',
    autor: '',
    preco: '',
    quantidade: ''
  });

  const [novoEmprestimo, setNovoEmprestimo] = useState({
    livroId: '',
    nomeCliente: '',
    telefone: ''
  });

  // Estados para modal de venda
  const [modalVendaVisivel, setModalVendaVisivel] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState<Livro | null>(null);
  const [quantidadeVenda, setQuantidadeVenda] = useState('1');

  // Funções para gerenciar livros
  const adicionarLivro = () => {
    if (!novoLivro.titulo || !novoLivro.autor || !novoLivro.preco || !novoLivro.quantidade) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const livro: Livro = {
      id: Date.now().toString(),
      titulo: novoLivro.titulo,
      autor: novoLivro.autor,
      preco: parseFloat(novoLivro.preco),
      quantidade: parseInt(novoLivro.quantidade)
    };

    setLivros([...livros, livro]);
    setNovoLivro({ titulo: '', autor: '', preco: '', quantidade: '' });
    Alert.alert('Sucesso', 'Livro adicionado ao estoque');
  };

  // Função para abrir modal de venda
  const abrirModalVenda = (livro: Livro) => {
    setLivroSelecionado(livro);
    setQuantidadeVenda('1');
    setModalVendaVisivel(true);
  };

  // Função para realizar venda
  const realizarVenda = () => {
    if (!livroSelecionado) return;

    const qtd = parseInt(quantidadeVenda);

    if (isNaN(qtd) || qtd <= 0) {
      Alert.alert('Erro', 'Digite uma quantidade válida');
      return;
    }

    if (qtd > livroSelecionado.quantidade) {
      Alert.alert('Erro', 'Quantidade insuficiente no estoque');
      return;
    }

    const venda: Venda = {
      id: Date.now().toString(),
      livroId: livroSelecionado.id,
      tituloLivro: livroSelecionado.titulo,
      quantidade: qtd,
      valorTotal: livroSelecionado.preco * qtd,
      data: new Date().toLocaleDateString('pt-BR')
    };

    setVendas([...vendas, venda]);

    // Atualizar estoque
    setLivros(livros.map(l =>
      l.id === livroSelecionado.id
        ? { ...l, quantidade: l.quantidade - qtd }
        : l
    ));

    setModalVendaVisivel(false);
    Alert.alert('Sucesso', `Venda realizada! Total: R$ ${venda.valorTotal.toFixed(2)}`);
  };

  // Função para criar empréstimo
  const criarEmprestimo = () => {
    if (!novoEmprestimo.livroId || !novoEmprestimo.nomeCliente || !novoEmprestimo.telefone) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const livro = livros.find(l => l.id === novoEmprestimo.livroId);
    if (!livro || livro.quantidade === 0) {
      Alert.alert('Erro', 'Livro não disponível no estoque');
      return;
    }

    const emprestimo: Emprestimo = {
      id: Date.now().toString(),
      livroId: novoEmprestimo.livroId,
      tituloLivro: livro.titulo,
      nomeCliente: novoEmprestimo.nomeCliente,
      telefone: novoEmprestimo.telefone,
      dataEmprestimo: new Date().toLocaleDateString('pt-BR'),
      devolvido: false
    };

    setEmprestimos([...emprestimos, emprestimo]);

    // Reduzir estoque
    setLivros(livros.map(l =>
      l.id === livro.id
        ? { ...l, quantidade: l.quantidade - 1 }
        : l
    ));

    setNovoEmprestimo({ livroId: '', nomeCliente: '', telefone: '' });
    Alert.alert('Sucesso', 'Empréstimo registrado');
  };

  // Função para devolver livro
  const devolverLivro = (emprestimo: Emprestimo) => {
    setEmprestimos(emprestimos.map(e =>
      e.id === emprestimo.id
        ? { ...e, devolvido: true, dataRetorno: new Date().toLocaleDateString('pt-BR') }
        : e
    ));

    // Aumentar estoque
    setLivros(livros.map(l =>
      l.id === emprestimo.livroId
        ? { ...l, quantidade: l.quantidade + 1 }
        : l
    ));

    Alert.alert('Sucesso', 'Livro devolvido');
  };

  // Modal de Venda
  const ModalVenda = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVendaVisivel}
      onRequestClose={() => setModalVendaVisivel(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitulo}>Realizar Venda</Text>

          {livroSelecionado && (
            <View style={styles.livroInfo}>
              <Text style={styles.tituloLivro}>{livroSelecionado.titulo}</Text>
              <Text style={styles.autorLivro}>{livroSelecionado.autor}</Text>
              <Text style={styles.precoLivro}>R$ {livroSelecionado.preco.toFixed(2)}</Text>
              <Text style={styles.quantidadeLivro}>Disponível: {livroSelecionado.quantidade}</Text>
            </View>
          )}

          <Text style={styles.label}>Quantidade:</Text>
          <TextInput
            style={styles.input}
            value={quantidadeVenda}
            onChangeText={setQuantidadeVenda}
            keyboardType="numeric"
            placeholder="Digite a quantidade"
          />

          <View style={styles.modalBotoes}>
            <TouchableOpacity
              style={[styles.botao, styles.botaoCancelar]}
              onPress={() => setModalVendaVisivel(false)}
            >
              <Text style={styles.textoBotao}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botao, styles.botaoConfirmar]}
              onPress={realizarVenda}
            >
              <Text style={styles.textoBotao}>Confirmar Venda</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Tela de Estoque
  const TelaEstoque = () => (
    <FlatList
      style={styles.flatListContainer}
      data={livros}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View>
          <Text style={styles.titulo}>Estoque de Livros</Text>
          <View style={styles.formulario}>
            <Text style={styles.subtitulo}>Adicionar Novo Livro</Text>
            <TextInput
              style={styles.input}
              placeholder="Título do livro"
              value={novoLivro.titulo}
              onChangeText={(text) => setNovoLivro({...novoLivro, titulo: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Autor"
              value={novoLivro.autor}
              onChangeText={(text) => setNovoLivro({...novoLivro, autor: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Preço (ex: 25.00)"
              value={novoLivro.preco}
              keyboardType="numeric"
              onChangeText={(text) => setNovoLivro({...novoLivro, preco: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantidade"
              value={novoLivro.quantidade}
              keyboardType="numeric"
              onChangeText={(text) => setNovoLivro({...novoLivro, quantidade: text})}
            />
            <TouchableOpacity style={styles.botao} onPress={adicionarLivro}>
              <Text style={styles.textoBotao}>Adicionar Livro</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.itemLista}>
          <Text style={styles.tituloLivro}>{item.titulo}</Text>
          <Text style={styles.autorLivro}>{item.autor}</Text>
          <Text style={styles.precoLivro}>R$ {item.preco.toFixed(2)}</Text>
          <Text style={styles.quantidadeLivro}>Estoque: {item.quantidade}</Text>
        </View>
      )}
      contentContainerStyle={styles.flatListContent}
    />
  );

  // Tela de Vendas
  const TelaVendas = () => {
    const livrosDisponiveis = livros.filter(l => l.quantidade > 0);

    return (
      <View style={styles.appContainer}>
        <FlatList
          style={styles.flatListContainer}
          data={livrosDisponiveis}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View>
              <Text style={styles.titulo}>Vendas</Text>
              <Text style={styles.subtitulo}>Livros Disponíveis</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.itemLista}>
              <Text style={styles.tituloLivro}>{item.titulo}</Text>
              <Text style={styles.autorLivro}>{item.autor}</Text>
              <Text style={styles.precoLivro}>R$ {item.preco.toFixed(2)}</Text>
              <Text style={styles.quantidadeLivro}>Disponível: {item.quantidade}</Text>
              <TouchableOpacity
                style={styles.botaoVenda}
                onPress={() => abrirModalVenda(item)}
              >
                <Text style={styles.textoBotao}>Vender</Text>
              </TouchableOpacity>
            </View>
          )}
          ListFooterComponent={
            <View>
              <Text style={styles.subtitulo}>Histórico de Vendas</Text>
              {vendas.map((item) => (
                <View key={item.id} style={styles.itemVenda}>
                  <Text style={styles.tituloLivro}>{item.tituloLivro}</Text>
                  <Text>Quantidade: {item.quantidade}</Text>
                  <Text>Total: R$ {item.valorTotal.toFixed(2)}</Text>
                  <Text>Data: {item.data}</Text>
                </View>
              ))}
            </View>
          }
          contentContainerStyle={styles.flatListContent}
        />

        <ModalVenda />
      </View>
    );
  };

  // Tela de Empréstimos
  const TelaEmprestimos = () => (
    <FlatList
      style={styles.flatListContainer}
      data={emprestimos.filter(e => !e.devolvido)}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View>
          <Text style={styles.titulo}>Empréstimos</Text>
          <View style={styles.formulario}>
            <Text style={styles.subtitulo}>Novo Empréstimo</Text>
            <Text style={styles.label}>Selecionar Livro:</Text>
            <View style={styles.seletorLivros}>
              {livros.filter(l => l.quantidade > 0).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.botaoSelecao,
                    novoEmprestimo.livroId === item.id && styles.botaoSelecionado
                  ]}
                  onPress={() => setNovoEmprestimo({...novoEmprestimo, livroId: item.id})}
                >
                  <Text style={[
                    styles.textoSelecao,
                    novoEmprestimo.livroId === item.id && styles.textoSelecionado
                  ]}>
                    {item.titulo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nome do cliente"
              value={novoEmprestimo.nomeCliente}
              onChangeText={(text) => setNovoEmprestimo({...novoEmprestimo, nomeCliente: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Telefone"
              value={novoEmprestimo.telefone}
              keyboardType="phone-pad"
              onChangeText={(text) => setNovoEmprestimo({...novoEmprestimo, telefone: text})}
            />
            <TouchableOpacity style={styles.botao} onPress={criarEmprestimo}>
              <Text style={styles.textoBotao}>Criar Empréstimo</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitulo}>Empréstimos Ativos</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.itemEmprestimo}>
          <Text style={styles.tituloLivro}>{item.tituloLivro}</Text>
          <Text>Cliente: {item.nomeCliente}</Text>
          <Text>Telefone: {item.telefone}</Text>
          <Text>Data: {item.dataEmprestimo}</Text>
          <TouchableOpacity
            style={styles.botaoDevolver}
            onPress={() => devolverLivro(item)}
          >
            <Text style={styles.textoBotao}>Devolver</Text>
          </TouchableOpacity>
        </View>
      )}
      ListFooterComponent={
        <View>
          <Text style={styles.subtitulo}>Histórico de Devoluções</Text>
          {emprestimos.filter(e => e.devolvido).map((item) => (
            <View key={item.id} style={styles.itemHistorico}>
              <Text style={styles.tituloLivro}>{item.tituloLivro}</Text>
              <Text>Cliente: {item.nomeCliente}</Text>
              <Text>Empréstimo: {item.dataEmprestimo}</Text>
              <Text>Devolução: {item.dataRetorno}</Text>
            </View>
          ))}
        </View>
      }
      contentContainerStyle={styles.flatListContent}
    />
  );

  return (
    <View style={styles.appContainer}>
      {/* Menu de navegação */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={[styles.botaoMenu, telaAtual === 'estoque' && styles.botaoMenuAtivo]}
          onPress={() => setTelaAtual('estoque')}
        >
          <Text style={styles.textoMenu}>Estoque</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoMenu, telaAtual === 'vendas' && styles.botaoMenuAtivo]}
          onPress={() => setTelaAtual('vendas')}
        >
          <Text style={styles.textoMenu}>Vendas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoMenu, telaAtual === 'emprestimos' && styles.botaoMenuAtivo]}
          onPress={() => setTelaAtual('emprestimos')}
        >
          <Text style={styles.textoMenu}>Empréstimos</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo das telas */}
      {telaAtual === 'estoque' && <TelaEstoque />}
      {telaAtual === 'vendas' && <TelaVendas />}
      {telaAtual === 'emprestimos' && <TelaEmprestimos />}
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  menu: {
    flexDirection: 'row',
    backgroundColor: '#4a90e2',
    paddingTop: 40,
  },
  botaoMenu: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  botaoMenuAtivo: {
    backgroundColor: '#357abd',
  },
  textoMenu: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  // Novos estilos para FlatList
  flatListContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  flatListContent: {
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#555',
  },
  formulario: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginVertical: 8,
    borderRadius: 5,
    fontSize: 16,
  },
  botao: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  botaoVenda: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoDevolver: {
    backgroundColor: '#ffc107',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemLista: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  itemVenda: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  itemEmprestimo: {
    backgroundColor: '#fff3cd',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  itemHistorico: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#6c757d',
  },
  tituloLivro: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  autorLivro: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  precoLivro: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  quantidadeLivro: {
    fontSize: 14,
    color: '#666',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  botaoSelecao: {
    backgroundColor: '#e9ecef',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  botaoSelecionado: {
    backgroundColor: '#4a90e2',
  },
  textoSelecao: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  textoSelecionado: {
    color: 'white',
  },
  seletorLivros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  // Estilos do modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  livroInfo: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  modalBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  botaoCancelar: {
    backgroundColor: '#6c757d',
    flex: 1,
    marginRight: 10,
  },
  botaoConfirmar: {
    backgroundColor: '#28a745',
    flex: 1,
    marginLeft: 10,
  },
});

export default App;