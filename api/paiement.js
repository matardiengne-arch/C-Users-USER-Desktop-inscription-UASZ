export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { prenom, nom } = req.body;

  // 1. Remplacez ici par vos vraies clés visibles sur votre capture PayTech
  const apiKey = "286db3f32867473e6a46d92a07381228841e99efce5bd79b690d1cf0ed2f6913";
  const apiSecret = "748a8279ca3b2a6d6e51f27892703f530ccab251b14344ed30c85f51cc77880f";

  const data = {
    item_name: `Inscription Amicale UASZ - ${prenom} ${nom}`,
    item_price: "5000", // Le montant en FCFA
    currency: "XOF",
    ref_command: `UASZ-${Date.now()}`, // Génère un numéro de commande unique
    command_name: "Paiement inscription Amicale",
    env: "live", // Mettez "live" pour de vrais paiements ou "test" pour essayer
    success_url: `https://${req.headers.host}/index.html?status=success`,
    cancel_url: `https://${req.headers.host}/index.html?status=cancel`
  };

  try {
    const response = await fetch("https://paytech.sn/api/payment/request-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API_KEY": apiKey,
        "API_SECRET": apiSecret
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success === 1 || result.success === "1") {
      // On renvoie le lien de paiement PayTech vers le HTML
      return res.status(200).json({ redirect_url: result.redirect_url });
    } else {
  // Ceci affichera la vraie raison renvoyée par PayTech dans votre alerte
  return res.status(400).json({ error: JSON.stringify(result) });
}
  } catch (error) {
    return res.status(500).json({ error: "Erreur de connexion au serveur" });
  }
}