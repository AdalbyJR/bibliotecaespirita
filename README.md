// Correção na função renderHeaderEmprestimos - linha 284
const renderHeaderEmprestimos = () => {
return (
<View>
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
);
};

// Adicione este estilo no StyleSheet
const styles = StyleSheet.create({
// ... outros estilos existentes ...

textoSelecao: {
fontSize: 12,
fontWeight: 'bold',
color: '#333', // Cor padrão
},

// Novo estilo para texto selecionado
textoSelecionado: {
color: 'white', // Cor branca quando selecionado
},

// ... resto dos estilos ...
});