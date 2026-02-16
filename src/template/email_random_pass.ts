export const emailRandomPassTemplate = (email: string, senha: string): string => (
   `<p>Olá,</p>
          <p>Bem-vindo à Siena! Sua conta de escola foi criada com sucesso.</p>
          <p>Aqui estão suas credenciais de acesso:</p>
          <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Senha:</strong> ${senha}</li>
          </ul>
          <p>Recomendamos que você altere sua senha após o primeiro login para garantir a segurança da sua conta.</p>
          <p>Atenciosamente,<br/>Equipe Siena</p>`
);