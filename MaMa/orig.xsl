<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:tei="http://www.tei-c.org/ns/1.0"  
  exclude-result-prefixes="tei">
  <xsl:output method="xml" encoding="UTF-8"/>
  <!-- this is the identity transform template !-->
  <xsl:strip-space elements="tei:*"/>
  <xsl:template match="/|@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>

  <!-- only put in "orig" in "choice" elements !-->
  <xsl:template match="tei:choice[not(@type='chaya')]">
    <xsl:choose>
      <xsl:when test="tei:corr">
	<xsl:copy>
	  <xsl:apply-templates select="@*|node()"/>
	</xsl:copy>
      </xsl:when>
      <xsl:otherwise>
	<xsl:apply-templates select="tei:orig/@*|tei:orig/node()"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
